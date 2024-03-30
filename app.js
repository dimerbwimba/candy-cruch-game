document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector(".grid")
    const width = 8
    const squares = []
    const emojis = [
        "🍬", // candy
        "🍭", // lollipop
        "🍫", // chocolate bar
        "🍩", // doughnut
        "🍪", // cookie
        "🍦"  // ice cream
    ]

    let emojiBeingDragged
    let squareIdBeingDragged
    let squareIdBeingReplaced
    let score = 0
    const scoreDisplay = document.getElementById("score")

    // Create the board
    function createBoard(){
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div")
            square.setAttribute('draggable', true)
            square.setAttribute('id', i)
            let randomEmoji = Math.floor(Math.random() * emojis.length)
            square.innerHTML = emojis[randomEmoji]

            grid.appendChild(square)
            squares.push(square)
        }
    }
    createBoard()

    // Event delegation for drag and drop
    grid.addEventListener("dragstart", (e) => {
        const square = e.target
        emojiBeingDragged = square.innerHTML
        squareIdBeingDragged = parseInt(square.id)
    })

    grid.addEventListener("dragover", (e) => {
        e.preventDefault()
    })

    grid.addEventListener("dragenter", (e) => {
        e.preventDefault()
    })

    grid.addEventListener("dragleave", () => {
    })

    grid.addEventListener("drop", (e) => {
        const square = e.target
        emojiBeingReplaced = square.innerHTML
        squareIdBeingReplaced = parseInt(square.id)
        square.innerHTML = emojiBeingDragged
        squares[squareIdBeingDragged].innerHTML = emojiBeingReplaced
        updateScore()
    })

    grid.addEventListener("dragend", () => {
        const validMoves = [
            squareIdBeingDragged - 1, 
            squareIdBeingDragged - width,
            squareIdBeingDragged + 1,
            squareIdBeingDragged + width
        ]

        const isValidMove = validMoves.includes(squareIdBeingReplaced)
        if (squareIdBeingReplaced && isValidMove) {
            squareIdBeingReplaced = null
        } else if (squareIdBeingReplaced && !isValidMove) {
            squares[squareIdBeingReplaced].innerHTML = emojiBeingReplaced
            squares[squareIdBeingDragged].innerHTML = emojiBeingDragged
        } else {
            squares[squareIdBeingDragged].innerHTML = emojiBeingDragged
        }
    })

    // Check for rows of three
    function checkRowForThree(start, step) {
        for (let i = start; i < start + (width - 2) * step; i += step) {
            let rowOfThree = [i, i + step, i + step * 2]
            let decidedEmoji = squares[i].innerHTML
            const isBlank = squares[i].innerHTML === ''
            if (rowOfThree.every(index => squares[index].innerHTML === decidedEmoji && !isBlank)) {
                rowOfThree.forEach(index => {
                    squares[index].innerHTML = ''
                    score += 1 // Increment score for each candy removed
                })
            } 
        }
    }

    // Check rows and columns for three candies
    function checkRowsAndColumns() {
        for (let i = 0; i < width; i++) {
            checkRowForThree(i * width, 1)  // Rows
            checkRowForThree(i, width)      // Columns
        }
    }

    // Update score display
    function updateScore() {
        scoreDisplay.textContent = score
    }

    // Interval check for rows and columns of three
    window.setInterval(() => {
        checkRowsAndColumns()
        updateScore()
    }, 100)
})
