/* Code Quest — turns scary Python tracebacks into friendly, specific hints.
   A 10-year-old should never see a raw traceback. */
(function (global) {
  function extractExceptionLine(rawMessage) {
    if (!rawMessage) return null;
    const lines = String(rawMessage).trim().split("\n");
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i].trim();
      const match = line.match(/^([A-Za-z_][A-Za-z0-9_.]*)\s*:\s*(.*)$/);
      if (match && /Error|Exception|Warning/.test(match[1])) {
        return { type: match[1], detail: match[2] };
      }
    }
    // Some errors (like plain SyntaxError under exec) show without a colon-detail
    const last = lines[lines.length - 1].trim();
    const bare = last.match(/^([A-Za-z_][A-Za-z0-9_.]*)$/);
    if (bare && /Error|Exception|Warning/.test(bare[1])) {
      return { type: bare[1], detail: "" };
    }
    return null;
  }

  function quoteName(detail, fallback) {
    const m = detail && detail.match(/'([^']*)'/);
    return m ? m[1] : fallback;
  }

  const FRIENDLY_BUILDERS = {
    NameError(detail) {
      const name = quoteName(detail, "that word");
      return `Looks like you used a box called "${name}" before giving it a name (creating it). Check your spelling, and make sure you set it with = before you use it. Example: ${name} = 5`;
    },
    SyntaxError(detail) {
      return "Python got confused reading your code — something doesn't look quite right, like a missing colon ':', a missing closing quote, or an extra/missing bracket. Check the line the editor is pointing at!";
    },
    IndentationError() {
      return "Python cares a LOT about spacing! Lines inside a loop, if, or function need to be indented (start a little further right) by the same amount. Try lining up your spaces.";
    },
    TabError() {
      return "Your code mixes tabs and spaces for indenting. Pick one style (spaces are easiest) and use it for every line inside the same block.";
    },
    TypeError(detail) {
      if (detail && /concatenate/i.test(detail)) {
        return "You tried to join text and a number together directly. Wrap the number in str(...) first, like: \"Score: \" + str(score)";
      }
      if (detail && /positional argument/i.test(detail)) {
        return "A function was called with the wrong number of ingredients (arguments). Check how many things the function needs inside the parentheses.";
      }
      return "Two different kinds of things got mixed in a way Python doesn't understand — like adding text and a number directly. Try converting one with str(), int(), or float().";
    },
    ValueError(detail) {
      return "Python understood what you were trying to do, but the value doesn't fit — like trying to turn the word 'hello' into a number. Double check what you're converting or passing in.";
    },
    ZeroDivisionError() {
      return "Whoops — dividing by zero breaks math itself, even for computers! Make sure the number you're dividing by is never 0.";
    },
    IndexError() {
      return "You asked for an item at a spot in a list that doesn't exist — like asking for the 10th cookie in a jar of 3. Remember, list positions (indexes) start at 0!";
    },
    KeyError(detail) {
      const key = quoteName(detail, "that key");
      return `Your dictionary doesn't have anything stored under "${key}". Double-check the spelling, or make sure you added it first.`;
    },
    AttributeError(detail) {
      return "You tried to use a power-up (a method or property) that this kind of thing doesn't have — check the spelling, and make sure it's a dot . on the right variable.";
    },
    ModuleNotFoundError(detail) {
      const name = quoteName(detail, "that module");
      return `Python couldn't find a toolbox called "${name}". Double check the spelling of your import.`;
    },
    ImportError(detail) {
      return "Something went wrong importing a toolbox (module). Double-check the name you're importing.";
    },
    RecursionError() {
      return "Your code called itself over and over and over, forever! If you're using a function that calls itself, make sure it has a stopping point.";
    },
    UnboundLocalError(detail) {
      const name = quoteName(detail, "that box");
      return `Inside a function you used the box "${name}" before it had a value there. Give it a value first, or pass it in as a parameter.`;
    },
    StopIteration() {
      return "Python ran out of items to loop through. This usually happens with advanced loops — double-check what you're looping over.";
    },
    OverflowError() {
      return "That number got way too big for Python to handle in this operation!";
    },
    KeyboardInterrupt() {
      return "The program was stopped.";
    },
  };

  function translate(rawMessage) {
    const found = extractExceptionLine(rawMessage);
    if (!found) {
      return {
        type: "Error",
        friendly: "Something didn't work quite right. Take a look at your code and try again — you've got this! 💪",
      };
    }
    const builder = FRIENDLY_BUILDERS[found.type];
    const friendly = builder
      ? builder(found.detail)
      : `Something called "${found.type}" happened. Take a peek at your code — you're close!`;
    return { type: found.type, detail: found.detail, friendly };
  }

  global.CodeQuestErrorTranslator = { translate, extractExceptionLine };
})(window);
