  // Open navmenu
  document.querySelector("#navbtn").addEventListener('click', () => {
    document.querySelector("#navmenu").classList.toggle("is-active")
  })

  // Close navmenu
  document.querySelector("#closenav").addEventListener('click', () => {
    document.querySelector("#navmenu").classList.toggle("is-active")
  })