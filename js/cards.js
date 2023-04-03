const startBtn = document.querySelector('#start'),
  overAgain = document.querySelector('#over'),
  screens = document.querySelectorAll('.screen')
const modal = document.querySelector('.modal'),
  overlayModal = document.querySelector('.overlay-modal'),
  modalDesc = document.querySelector('.modal__description'),
  modalDescTime = document.querySelector('.modal__description-time')
const board = document.querySelector('#board'),
  overTotalDesc = document.querySelector('.over__description'),
  overTotalDescLevel = document.querySelector('.over__description-level'),
  overTotalDescTime = document.querySelector('.over__description-time'),
  levelList = document.querySelector('#level-list')

const billetCards = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8]
const cards = [],
  createCard = []
let count = 0,
  countOver = 0,
  counterPairCard = 0
const endGame = billetCards.length / 2
let timerId = null,
  timerOverId = null
let timeToClose, timerBegin, timerEnd
let levelGame, levelDescription
let isOver = false

const music = new Audio()
music.loop = true
const sound = new Audio(),
  sound2 = new Audio(),
  sound3 = new Audio()

music.src = 'https://brainfixer.github.io/CodePenSnippets/music.mp3'
sound.src = 'https://brainfixer.github.io/CodePenSnippets/sound.mp3'
sound2.src = 'https://brainfixer.github.io/CodePenSnippets/sound2.mp3'
sound3.src = 'https://brainfixer.github.io/CodePenSnippets/sound3.mp3'

startBtn.onclick = (e) => {
  e.preventDefault()
  sound.play()
  screens[0].classList.add('up')
}

overAgain.onclick = (e) => {
  e.preventDefault()
  clearInterval(timerOverId)
  cards.splice(0, 16)
  createCard.splice(0, 2)
  board.innerHTML = ''
  count = 0
  countOver = 0
  counterPairCard = 0
  isOver = false
  screens[0].classList.remove('up')
  screens[1].classList.remove('up')
  screens[2].classList.remove('up')
  sound.play()
}

levelList.onclick = (e) => {
  e.preventDefault()
  if (e.target.classList.contains('level-btn')) {
    levelGame = parseInt(e.target.getAttribute('data-level'))
    screens[1].classList.add('up')
    console.log('level ', levelGame)
    sound.play()
    startGame()
  }
}

const randomSortCards = () => cards.sort((a, b) => (a.order < b.order ? -1 : 1))

const prepareCards = (level = 1) => {
  for (let i = 0; i < billetCards.length; i++) {
    let card = {
      suit: false,
      flip: false,
      number: billetCards[i],
      order: Math.floor(Math.random() * 16000 * level) + 1,
    }
    cards.push(card)
  }
  randomSortCards()
}

const generateBoard = () => {
  for (let i = 0; i < cards.length; i++) {
    const square = document.createElement('div')
    square.classList.add('card')
    square.dataset.card = cards[i].number
    square.innerHTML = `<div class="card__face card__face--front" data-card="${cards[i].number}"><p>${cards[i].number}</p></div>
		<div class="card__face card__face--back" data-card="${cards[i].number}"></div>`
    square.classList.add('is-flipped')
    board.append(square)
  }
}

const getRndInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const checkCard = () => (createCard[0].item === createCard[1].item ? true : false)

const changeFace = (level = 2) => {
  const cardFace = document.querySelectorAll('.card > .card__face.card__face--back')
  cardFace.forEach(
    (i) =>
      (i.style.backgroundImage = `url('img/bg${getRndInt(1,level)}.jpg')`)
  )
  if (isOver) {
    cardFace[
      getRndInt(1, 15)
    ].style.backgroundImage = `url('img/bg9.jpg')`
    cardFace[
      getRndInt(1, 15)
    ].style.backgroundImage = `url('img/bg10.jpg')`
  } else {
    cardFace[
      getRndInt(1, 15)
    ].style.backgroundImage = `url('img/bg10.jpg')`
  }
}

const clearGame = () => {
  if (createCard.length > 0) createCard.splice(0, createCard.length)
  cards.forEach((item) => {
    item.flip = false
    item.suit = false
  })
  // можно и перемешать, но...
}

const randomReversFrontSide = () => {
  document.querySelectorAll('.card').forEach((i) => {
    if (getRndInt(1, 2) === 2) i.classList.add('rotate--front')
  })
}

const startGame = () => {
  prepareCards(levelGame)
  generateBoard()

  switch (levelGame) {
    case 1:
      timeToClose = 600
      levelDescription = 'простой'
      break
    case 4:
      timeToClose = 400
      levelDescription = 'средний'
      changeFace(levelGame)
      break
    case 8:
      timeToClose = 300
      levelDescription = 'сложный'
      isOver = true
      randomReversFrontSide()
      changeFace(levelGame)
      break
  }

  const cardBoard = document.querySelectorAll('.card')

  cardBoard.forEach((item, idx) => {
    item.addEventListener('click', function (event) {
      event.preventDefault()
      sound.play()
      // если закрыта
      if (!cards[idx].flip && !cards[idx].suit) {
        count++
        sound.play()
        if (count === 1) {
          timerBegin = Date.now()
        }
        if (count === 50) {
          music.pause()
          sound3.play()
          // music.playbackRate = 1.5
          modal.classList.add('active')
          overlayModal.classList.add('active')
          modalDesc.innerHTML = `Уже было ${count} попыток`
          modalDescTime.innerHTML = 'Надо быть более внимательным'
        }
        if (isOver) {
          countOver++
          console.log('Тучи сгущаются ', countOver)
          music.play()
        }
        if (countOver > 14) {
          countOver = 0
          counterPairCard = 0
          clearGame()
          clearTimeout(timerId)
          cardBoard.forEach((item) => {
            item.classList.add('is-flipped')
          })
        } else {
          item.classList.toggle('is-flipped')
          cards[idx].flip = !cards[idx].flip
          createCard.push({
            item: event.target.dataset.card,
            position: idx,
          })
          // проверка и закрытие
          if (createCard.length > 1) {
            if (checkCard()) {
              cards[createCard[0].position].suit = true
              cards[createCard[1].position].suit = true
              createCard.splice(0, 2)
              clearTimeout(timerId)
              if (isOver) {
                countOver -= 2
                console.log('Барсук выдыхай ', countOver)
              }
              counterPairCard++
              // конец игры
              if (counterPairCard == endGame) {
                timerEnd = Date.now()
                music.pause()
                sound2.play()
                overTotalDesc.innerHTML = `Всего  попыток: ${count}.`
                overTotalDescLevel.innerHTML = `Уровень игры <span>${levelDescription}</span>.`
                overTotalDescTime.innerHTML = 'Время игры: ' + msToTime(timerEnd - timerBegin)
                timerOverId = setTimeout(() => {
                  screens[2].classList.add('up')
                }, 1000)
              }
            } else {
              timerId = setTimeout(() => {
                cards[createCard[0].position].flip = false
                cards[createCard[1].position].flip = false
                cardBoard[createCard[0].position].classList.toggle('is-flipped')
                cardBoard[createCard[1].position].classList.toggle('is-flipped')
                createCard.splice(0, 2)
              }, timeToClose)
            }
          }
        }
      } else if (counterPairCard < endGame && !cards[idx].suit) {
        item.classList.toggle('is-flipped')
        cards[idx].flip = !cards[idx].flip
        createCard.splice(0, 1)
      }
      // console.log(event)
    })
  })
}

const msToTime = (time) => {
  let milliseconds = Math.floor((time % 1000) / 100),
    seconds = Math.floor((time / 1000) % 60),
    minutes = Math.floor((time / (1000 * 60)) % 60)
  // hours = Math.floor((time / (1000 * 60 * 60)) % 24)
  // hours = hours < 10 ? '0' + hours : hours
  minutes = minutes < 10 ? '0' + minutes : minutes
  seconds = seconds < 10 ? '0' + seconds : seconds
  milliseconds = milliseconds < 10 ? '0' + milliseconds : milliseconds
  return minutes + 'м ' + seconds + 'с ' + milliseconds + 'мс'
}
