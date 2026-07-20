# Code Quest — Streamlit wrapper.
#
# Streamlit's html component renders inside an iframe that cannot resolve the
# app's relative files (css/, js/, vendor/, python/). So instead of embedding
# index.html as-is, this builds a fully self-contained page:
#   - css/styles.css and every js/*.js file are inlined
#   - Pyodide and CodeMirror load from a CDN instead of vendor/
#   - the turtle shim source is embedded as a JS global
# The static-site deployment (GitHub Pages / any file server) is unaffected —
# it keeps using the local vendored copies and works offline.
import json
import re
from pathlib import Path

import streamlit as st
import streamlit.components.v1 as components

ROOT = Path(__file__).parent

PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/"
CODEMIRROR_CDN = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/"


def js_string(text: str) -> str:
    # json.dumps gives a valid JS string literal; break "</" so the payload
    # can never terminate the surrounding <script> block early.
    return json.dumps(text).replace("</", "<\\/")


@st.cache_data
def build_html() -> str:
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    css = (ROOT / "css" / "styles.css").read_text(encoding="utf-8")
    shim = (ROOT / "python" / "turtle_shim.py").read_text(encoding="utf-8")

    # Stylesheets: CodeMirror from CDN, app styles inlined.
    html = html.replace(
        '<link rel="stylesheet" href="vendor/codemirror/lib/codemirror.css" />',
        f'<link rel="stylesheet" href="{CODEMIRROR_CDN}codemirror.min.css" />',
    )
    html = html.replace(
        '<link rel="stylesheet" href="vendor/codemirror/theme/dracula.css" />',
        f'<link rel="stylesheet" href="{CODEMIRROR_CDN}theme/dracula.min.css" />',
    )
    html = html.replace(
        '<link rel="stylesheet" href="css/styles.css" />',
        "<style>\n" + css + "\n</style>",
    )

    # Config globals must be defined before any app script runs.
    config = (
        "<script>\n"
        f"window.CODEQUEST_PYODIDE_BASE = {js_string(PYODIDE_CDN)};\n"
        f"window.CODEQUEST_TURTLE_SHIM = {js_string(shim)};\n"
        "</script>"
    )

    # Runtime scripts: vendored copies -> CDN.
    html = html.replace(
        '<script src="vendor/pyodide/pyodide.js"></script>',
        config + f'\n<script src="{PYODIDE_CDN}pyodide.js"></script>',
    )
    html = html.replace(
        '<script src="vendor/codemirror/lib/codemirror.js"></script>',
        f'<script src="{CODEMIRROR_CDN}codemirror.min.js"></script>',
    )
    html = html.replace(
        '<script src="vendor/codemirror/mode/python/python.js"></script>',
        f'<script src="{CODEMIRROR_CDN}mode/python/python.min.js"></script>',
    )
    html = html.replace(
        '<script src="vendor/codemirror/addon/edit/matchbrackets.js"></script>',
        f'<script src="{CODEMIRROR_CDN}addon/edit/matchbrackets.min.js"></script>',
    )

    # App scripts: inline every js/*.js file.
    def inline_script(match: re.Match) -> str:
        source = (ROOT / match.group(1)).read_text(encoding="utf-8")
        return "<script>\n" + source + "\n</script>"

    html = re.sub(r'<script src="(js/[^"]+)"></script>', inline_script, html)
    return html


st.set_page_config(
    page_title="Code Quest — Learn Python!",
    page_icon="🐍",
    layout="wide",
    initial_sidebar_state="collapsed",
)

st.markdown(
    """<style>
    #MainMenu, header, footer {visibility: hidden;}
    .stMainBlockContainer, .block-container {padding: 0 !important; max-width: 100% !important;}
    iframe {border: none;}
    </style>""",
    unsafe_allow_html=True,
)

components.html(build_html(), height=1800, scrolling=True)
