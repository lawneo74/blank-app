/* Code Quest — the full 8-level curriculum. Every lesson is explanation ->
   worked example -> hands-on challenge -> feedback, as required by the
   lesson structure. Keep language short and concrete for a 10-year-old. */
(function (global) {
  function wordCount(stdout) {
    return stdout.split("\n").filter((line) => line.trim().length > 0).length;
  }

  const LESSONS = [
    {
      id: 1,
      key: "level-1",
      emoji: "🏝️",
      islandName: "Hello Island",
      title: "Say Hello",
      guideIntro: [
        "Ahoy! I'm Fenn, your guide through Code Quest! 🦊",
        "Every great coder starts with one word: hello. Let's make the computer talk!",
      ],
      explanation: {
        heading: "What is a program?",
        analogy:
          "A program is like a recipe. You write the steps once, in order, and the computer follows them exactly — every single time, without ever getting bored!",
        points: [
          "print() is like a megaphone 📣 — whatever you put inside the parentheses gets shouted out on the screen.",
          "Text you want printed goes inside quotes, like \"this\".",
          "The computer runs your code from top to bottom, one line at a time.",
        ],
      },
      example: {
        code: 'print("Hello, world!")\nprint("I am learning Python!")',
        note: "Press Run and watch both lines appear below, in order.",
      },
      challenge: {
        starterCode: '# Use print() to introduce yourself!\nprint("My name is ___")\nprint("My favorite thing to do is ___")\n',
        instructions:
          "Fill in the blanks with your own words (keep the quotes!) and press Run.",
        hints: [
          "Make sure your text is inside quotes, like \"I like pizza\".",
          "Each print() needs its own opening ( and closing ) parentheses.",
        ],
        check(result) {
          if (!result.success) return { pass: false };
          return { pass: wordCount(result.stdout) >= 1 };
        },
      },
    },

    {
      id: 2,
      key: "level-2",
      emoji: "📦",
      islandName: "Boxville",
      title: "Boxes for Stuff",
      guideIntro: [
        "Welcome to Boxville! Everything here gets stored in labeled boxes. 📦",
        "In Python we call these boxes variables.",
      ],
      explanation: {
        heading: "What is a variable?",
        analogy:
          "A variable is a labeled box you can put something inside, and peek into later. score = 10 means: make a box called score, and put the number 10 inside it.",
        points: [
          "str (string) boxes hold text, always inside quotes: name = \"Ava\"",
          "int boxes hold whole numbers: age = 10",
          "bool boxes hold just True or False, like an on/off switch: is_coder = True",
          "You can look inside a box anytime with print(box_name).",
        ],
      },
      example: {
        code: 'name = "Ava"\nage = 10\nis_coder = True\n\nprint(name)\nprint(age)\nprint(is_coder)',
        note: "Three boxes, three peeks — run it and see all three values appear.",
      },
      challenge: {
        starterCode:
          '# Make three boxes about YOU, then print each one\nmy_name = "???"\nmy_age = 0\nloves_python = False\n\nprint(my_name)\nprint(my_age)\nprint(loves_python)\n',
        instructions:
          "Replace ???, 0, and False with real info about yourself, then press Run.",
        hints: [
          "Keep the quotes around text, but numbers and True/False don't need quotes.",
          "Change loves_python to True if you're enjoying this!",
        ],
        check(result) {
          if (!result.success) return { pass: false };
          return { pass: wordCount(result.stdout) >= 3 };
        },
      },
    },

    {
      id: 3,
      key: "level-3",
      emoji: "🎤",
      islandName: "Question Cove",
      title: "Ask & Answer",
      guideIntro: [
        "This cove is full of curious echoes! Let's ask the player some questions. 🎤",
      ],
      explanation: {
        heading: "What is input()?",
        analogy:
          "input() is like asking a question out loud and waiting quietly until someone answers, before you do anything else. Whatever they type gets handed back to you as text.",
        points: [
          "input(\"Question? \") shows a question and waits for an answer.",
          "Whatever you get back is always text (a string) — even if someone types a number!",
          "You can save the answer in a box (variable) to use later.",
        ],
      },
      example: {
        code: 'name = input("What is your name? ")\nprint("Nice to meet you, " + name + "!")',
        note: "A popup box will ask the question — type an answer and press OK.",
      },
      challenge: {
        starterCode:
          '# Ask two questions and greet the player using both answers\nfavorite_color = input("What is your favorite color? ")\nfavorite_animal = input("What is your favorite animal? ")\n\nprint("A " + favorite_color + " " + favorite_animal + " sounds awesome!")\n',
        instructions:
          "Press Run, then answer both popup questions to see your custom sentence.",
        hints: [
          "The + between pieces of text glues them together — just make sure there's text on both sides.",
          "If a popup doesn't show, check that your browser isn't blocking it.",
        ],
        check(result) {
          return { pass: result.success };
        },
      },
    },

    {
      id: 4,
      key: "level-4",
      emoji: "🚦",
      islandName: "Fork-in-the-Road Forest",
      title: "Yes or No",
      guideIntro: [
        "This forest is full of forks in the road. Which path should we take? 🚦",
      ],
      explanation: {
        heading: "What is a conditional?",
        analogy:
          "if is a fork in the road for your code. The computer checks a yes/no question, and only walks down the matching path — the other path gets skipped completely.",
        points: [
          "if condition: runs its indented lines only when the condition is True.",
          "elif (\"else if\") checks another condition if the first was False.",
          "else catches everything else, with no condition needed.",
          "Comparisons like >=, ==, and < ask yes/no questions.",
        ],
      },
      example: {
        code:
          'age = 10\n\nif age >= 10:\n    print("You can join the big kids club!")\nelse:\n    print("You\'re still little — that\'s OK too!")',
        note: "Try changing age to a smaller number later and run it again!",
      },
      challenge: {
        starterCode:
          '# Change the score and Run to see different messages!\nscore = 75\n\nif score >= 90:\n    print("A+ Superstar! 🌟")\nelif score >= 70:\n    print("Great job! 👍")\nelse:\n    print("Keep practicing — you\'ll get it! 💪")\n',
        instructions:
          "Run it once, then change the score number and Run again — see how the path changes!",
        hints: [
          "Don't forget the colon : at the end of if/elif/else lines.",
          "The indented lines (with spaces at the start) belong to the if/elif/else above them.",
        ],
        check(result) {
          return { pass: result.success };
        },
      },
    },

    {
      id: 5,
      key: "level-5",
      emoji: "🔁",
      islandName: "Loop-the-Loop Lagoon",
      title: "Do It Again",
      guideIntro: [
        "Round and round we go! This lagoon is all about repeating things. 🔁",
      ],
      explanation: {
        heading: "What is a loop?",
        analogy:
          "A loop is a chore you repeat, instead of writing 'jump' five separate times, you tell the computer 'repeat jump 5 times' and it does the boring repeating for you.",
        points: [
          "for i in range(5): repeats the indented lines exactly 5 times.",
          "while condition: keeps repeating as long as the condition stays True.",
          "The variable i changes each time through a for loop — try printing it!",
        ],
      },
      example: {
        code: 'for i in range(5):\n    print("Coding is fun! 🐍")',
        note: "range(5) means \"do this 5 times\" — 0, 1, 2, 3, 4.",
      },
      challenge: {
        starterCode:
          '# Countdown from 5 to 1, then blast off!\nfor i in range(5, 0, -1):\n    print(i)\n\nprint("Blast off! 🚀")\n',
        instructions:
          "Run it, then try changing the 5 to a bigger number for a longer countdown.",
        hints: [
          "range(5, 0, -1) counts DOWN from 5 to 1 — the -1 means \"go backwards by 1\".",
          "Make sure the print(i) line is indented under the for line.",
        ],
        check(result) {
          return { pass: result.success };
        },
      },
    },

    {
      id: 6,
      key: "level-6",
      emoji: "🎒",
      islandName: "Backpack Bay",
      title: "Collections",
      guideIntro: [
        "Everyone in Backpack Bay carries a list of their favorite things! 🎒",
      ],
      explanation: {
        heading: "What is a list?",
        analogy:
          "A list is a backpack with numbered pockets, and the FIRST pocket is number 0, not 1! pets[0] means \"look in pocket 0\".",
        points: [
          "Make a list with square brackets: pets = [\"dog\", \"cat\", \"hamster\"]",
          "Get one item with its position: pets[0] is \"dog\".",
          "len(pets) tells you how many items are inside.",
          "pets.append(\"parrot\") adds a new item to the end.",
        ],
      },
      example: {
        code:
          'pets = ["dog", "cat", "hamster"]\nprint(pets[0])\nprint(pets[1])\nprint(len(pets))\n\npets.append("parrot")\nprint(pets)',
        note: "Watch how append() grows the backpack by one more pocket.",
      },
      challenge: {
        starterCode:
          '# Make a list of your 3 favorite foods\nfoods = ["pizza", "ice cream", "tacos"]\n\nprint(foods[0])\nprint("I have " + str(len(foods)) + " favorite foods!")\n\nfoods.append("cookies")\nprint(foods)\n',
        instructions:
          "Change the foods to your own favorites, then press Run.",
        hints: [
          "Keep each food inside its own quotes, separated by commas.",
          "str(len(foods)) turns the count into text so it can join with + .",
        ],
        check(result) {
          if (!result.success) return { pass: false };
          return { pass: wordCount(result.stdout) >= 2 };
        },
      },
    },

    {
      id: 7,
      key: "level-7",
      emoji: "🛠️",
      islandName: "Function Foundry",
      title: "Your Own Commands",
      guideIntro: [
        "Welcome to the Foundry, where we forge brand new commands! 🛠️",
      ],
      explanation: {
        heading: "What is a function?",
        analogy:
          "A function is a trick you teach the computer once. After that, you can call it by name as many times as you like, with different inputs each time!",
        points: [
          "def my_trick(): starts a new function named my_trick.",
          "Things in the parentheses, like def greet(name):, are parameters — inputs the function needs.",
          "return sends a value back out of the function to be used elsewhere.",
          "Calling greet(\"Sam\") actually runs the function's steps.",
        ],
      },
      example: {
        code:
          'def greet(name):\n    print("Hello, " + name + "! Welcome to Code Quest.")\n\ngreet("Sam")\ngreet("Maya")',
        note: "One function, called twice with two different names.",
      },
      challenge: {
        starterCode:
          '# Write a function that adds two numbers and returns the result\ndef add_numbers(a, b):\n    result = a + b\n    return result\n\ntotal = add_numbers(4, 7)\nprint(total)\nprint(add_numbers(10, 20))\n',
        instructions:
          "Run it, then try calling add_numbers with your own numbers!",
        hints: [
          "return sends the answer back — without it, the function would give you nothing.",
          "You can call add_numbers(...) as many times as you like, with different numbers.",
        ],
        check(result) {
          return { pass: result.success };
        },
      },
    },

    {
      id: 8,
      key: "level-8",
      emoji: "🐢",
      islandName: "Turtle Peak",
      title: "Capstone: Turtle Art",
      isCapstone: true,
      guideIntro: [
        "You made it to the summit! Here's a very special helper: a robot turtle with a pen tied to its tail. 🐢🖍️",
        "Tell it to move and turn, and it draws wherever it goes!",
      ],
      explanation: {
        heading: "Turtle graphics",
        analogy:
          "Imagine a turtle standing on a giant piece of paper holding a pen. forward(100) walks it forward and draws a line. right(90) spins it to face a new direction. Combine moving + turning + loops, and you can draw anything!",
        points: [
          "turtle.forward(100) moves forward 100 steps, drawing a line as it goes.",
          "turtle.right(90) / turtle.left(90) turns the turtle (in degrees).",
          "turtle.penup() lifts the pen (move without drawing); turtle.pendown() puts it back down.",
          "Combine a loop with forward + turn to draw shapes without repeating code!",
        ],
      },
      example: {
        code: 'import turtle\n\nfor i in range(4):\n    turtle.forward(100)\n    turtle.right(90)',
        note: "Four sides, four turns of 90 degrees — a perfect square!",
      },
      challenge: {
        starterCode:
          '# Draw a 5-pointed star!\nimport turtle\n\nturtle.color("purple")\nfor i in range(5):\n    turtle.forward(150)\n    turtle.right(144)\n',
        instructions:
          "Run it to see your star appear. Then try changing the angle or number of sides — can you make a spiral by growing forward() a little bit each time through the loop?",
        hints: [
          "A shape with N sides usually turns 360 / N degrees at each corner.",
          "For a spiral, try: turtle.forward(i * 5) inside a loop using range(60), turning a fixed angle each time.",
        ],
        check(result) {
          if (!result.success) return { pass: false };
          const drew =
            global.CodeQuestTurtleAPI && global.CodeQuestTurtleAPI.hasDrawing
              ? global.CodeQuestTurtleAPI.hasDrawing()
              : true;
          return { pass: drew, tip: drew ? null : "Your code ran, but I don't see any drawing yet — did you call turtle.forward() at least once?" };
        },
      },
    },
  ];

  global.CodeQuestLessons = LESSONS;
})(window);
