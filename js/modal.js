const modalButtons = document.querySelectorAll('.open-modal')
const overlay = document.querySelector('.overlay-modal'),
  closeButtons = document.querySelectorAll('.modal-close')

modalButtons.forEach((item) => {
  item.addEventListener('click', function (e) {
    e.preventDefault()
    const modalId = this.getAttribute('data-modal'),
      modalElem = document.querySelector('.modal[data-modal="' + modalId + '"]')
    modalElem.classList.add('active')
    overlay.classList.add('active')
  })
})

closeButtons.forEach((item) => {
  item.addEventListener('click', function (e) {
    const parentModal = this.closest('.modal')
    parentModal.classList.remove('active')
    overlay.classList.remove('active')
  })
})
document.body.addEventListener(
  'keyup',
  function (event) {
    // const key = e.keyCode
    if (event.keyCode == 27) {
      document.querySelector('.modal.active').classList.remove('active')
      document.querySelector('.overlay').classList.remove('active')
    }
  },
  false
)

overlay.addEventListener('click', function () {
  // console.log('overlay click')
  document.querySelector('.modal.active').classList.remove('active')
  this.classList.remove('active')
})