const $wr = document.querySelector('[data-wr]')
const $add_button = document.querySelector('[data-add]')
const $add_modal = document.querySelector('[data-add_modal]')
const $change_modal = document.querySelector('[data-change_modal]')
const $change_form = document.querySelector('[data-change_form]')
const $change_apply_button = document.querySelector('[data-change_apply]')

const $inputId = $change_modal.querySelector('[data-change_id]')
const $inputAge = $change_modal.querySelector('[data-change_age]')
const inputName = $change_modal.querySelector('[data-change_name]')
const inputRate = $change_modal.querySelector('[data-change_rate]')
const inputDescription = $change_modal.querySelector('[data-change_description]')
const inputFavourite = $change_modal.querySelector('[data-change-favourite]')
const inputImg = $change_modal.querySelector('[data-change_img]')
const inputPhoto = $change_modal.querySelector('[data-change_photo]')

let cats = []

// CARD
const $card_delete_buttons = document.querySelectorAll('[data-card_delete]')
console.log($card_delete_buttons)

// MODAL ADD
const $add_form = document.querySelector('[data-add_form]')
const $add_id = document.querySelector('#add-id')
const $add_age = document.querySelector('#add-age')
const $add_name = document.querySelector('#add-name')
const $add_rate = document.querySelector('#add-rate')
const $add_description = document.querySelector('#add-description')
const $add_favourite = document.querySelector('[data-add-favourite]')
const $add_img = document.querySelector('#add-img')


const generateCardHTML = (post) => `<div class="card" data-id="${post.id}">
    <img src=${post.img_link} class="card-img-top" alt="Without image">
    <div class="card-body">
      <h5 data-post_id class="card-title">Id: ${post.id}</h5>
      <h5 class="card-title">Name: ${post.name}</h5>
      <h5 class="card-title">Age: ${post.age}</h5>
      <h5 class="card-title">Rate: ${post.rate}</h5>
      <p class="card-text">${post.description}</p>
      <h5 class="card-title">Favourite: ${post.favourite}</h5>
      <button data-card_open type="button" class="btn btn-primary">open</button>
      <button data-card_delete type="button" class="btn btn-danger">delete</button>
      
    </div>
</div>`

function reloadCats() {
  fetch('http://sb-cats.herokuapp.com/api/2/techniquei/show')
    .then((responce) => responce.json())
    .then((json) => {
      cats = json.data
      console.log(cats)
      const postsHTML = cats.map((post) => generateCardHTML(post))
      console.log()
      $wr.innerHTML = ''
      $wr.insertAdjacentHTML('beforeend', postsHTML.join(''))
    })
}

reloadCats()

$wr.addEventListener('click', (event) => {
  const { target } = event
  console.log(target)
  const parent = target.parentNode
  const id_element = parent.querySelector('[data-post_id]')
  const { innerText } = id_element
  const id = innerText.replace(/[^0-9]/g, '')
  if (target.hasAttribute('data-card_open')) {
    console.log('show button clicked')
    console.log(cats[id - 1])
    $change_modal.classList.add('show')

    $inputId.innerText = id
    $inputId.setAttribute('placeholder', id)
    $inputAge.setAttribute('placeholder', cats[id - 1].age)
    inputName.setAttribute('placeholder', cats[id - 1].name)
    inputRate.setAttribute('placeholder', cats[id - 1].rate)
    inputDescription.setAttribute('placeholder', cats[id - 1].description)
    inputFavourite.checked = cats[id - 1].favourite
    inputImg.setAttribute('placeholder', cats[id - 1].img_link)
    inputPhoto.setAttribute('src', cats[id - 1].img_link)
    console.log(`log: ${$inputId.value}`)
  }
  if (target.hasAttribute('data-card_delete')) {
    console.log(`delete button clicked: ${id}`)
    fetch(`http://sb-cats.herokuapp.com/api/2/techniquei/delete/${id}`, { method: 'DELETE' })
      .then((responce) => responce.json())
      .then((json) => {
        reloadCats()
        alert(json.message)
      })
  }
})

document.body.addEventListener('click', (event) => {
  const { target } = event
  if (target.hasAttribute('data-change_close')) {
    console.log(target)
    $change_modal.classList.remove('show')
    $change_form.reset()
  }

  if (target.hasAttribute('data-modal_close')) {
    console.log(target)
    $add_modal.classList.remove('show')
    $add_form.reset()
  }

  if (target.hasAttribute('data-add')) {
    console.log('add')
    $add_modal.classList.add('show')
  }

  if (target.hasAttribute('data-change_apply')) {
    const editCat = {
      age: $inputAge.value,
      rate: inputRate.value,
      description: inputDescription.value,
      favourite: inputFavourite.checked,
      img_link: inputImg.value,
    }

    const editCat_2 = { favourite: false }

    Object.keys(editCat).forEach((e) => {
      if (editCat[e] != '') {
        editCat_2[e] = editCat[e]
      }
    })
    console.log(editCat_2)
    const editedCat_json = JSON.stringify(editCat_2)
    console.log(editedCat_json)
    fetch(`http://sb-cats.herokuapp.com/api/2/techniquei/update/${$inputId.getAttribute('placeholder')}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: editedCat_json,
    })
      .then((responce) => responce.json())
      .then((json) => {
        reloadCats()
        alert(json.message)
      })
  }

  if (target.hasAttribute('data-add_add')) {
    const newCat = {
      id: $add_id.value,
      age: $add_age.value,
      name: $add_name.value,
      rate: $add_rate.value,
      description: $add_description.value,
      favourite: $add_favourite.checked,
      img_link: $add_img.value,
    }

    const newCat_json = JSON.stringify(newCat)
    console.log(newCat_json)
    fetch('http://sb-cats.herokuapp.com/api/2/techniquei/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: newCat_json,
    })
      .then((responce) => responce.json())
      .then((json) => {
        alert(json.message)
        reloadCats()
      })
  }
})
