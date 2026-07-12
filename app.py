# app.py - minimal Streamlit wrapper
import streamlit as st
from pathlib import Path

st.set_page_config(layout="wide", initial_sidebar_state="collapsed")

# Hide Streamlit UI
hide_streamlit_style = """
<style>
#MainMenu {visibility: hidden;}
footer {visibility: hidden;}
.stMainBlockContainer {padding: 0; margin: 0;}
</style>
"""
st.markdown(hide_streamlit_style, unsafe_allow_html=True)

# Serve index.html as iframe
index_content = Path("index.html").read_text()
st.components.v1.html(index_content, height=900, scrolling=True)
