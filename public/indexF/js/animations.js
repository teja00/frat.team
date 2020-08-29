anime.timeline()
  .add({
    targets: '.ml8 .circle-white',
    scale: [0, 3],
    opacity: [1, 0],
    easing: "easeInOutExpo",
    rotateZ: 360,
    duration: 1100
  }).add({
    targets: '.ml8 .circle-container',
    scale: [0, 1],
    duration: 1100,
    easing: "easeInOutExpo",
    offset: '-=1000'
  }).add({
    targets: '.ml8 .letters-left',
    scale: [0, 1],
    opacity: [0,100],
    duration: 1200,
    offset: '-=550'
  }).add({
    targets: '.ml8 .bang',
    scale: [0, 1],
    opacity: [0,100],
    rotateZ: [45, 15],
    duration: 1200,
    offset: '-=1000'
  }).add({
    targets: '.ml8',
    opacity: 100,
   
    easing: "easeOutExpo",
    
  });

  // Wrap every letter in a span
// var textWrapper = document.querySelector('.ml14 .letters');
// textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

// anime.timeline()
//   .add({
//     targets: '.ml14 .line',
//     scaleX: [0,1],
//     opacity: [0.5,1],
//     easing: "easeInOutExpo",
//     duration: 900
//   }).add({
//     targets: '.ml14 .letter',
//     opacity: [0,1],
//     translateX: [40,0],
//     translateZ: 0,
//     scaleX: [0.3, 1],
//     easing: "easeOutExpo",
//     duration: 800,
//     offset: '-=600',
//     delay: (el, i) => 150 + 25 * i
//   }).add({
//     targets: '.ml14',
//     opacity: 0,
//     duration: 1000,
//     easing: "easeOutExpo",
//     delay: 1000
//   });*/ 