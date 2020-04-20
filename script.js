function openNav() {
  document.getElementById("mySidenav").style.width = "80%";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

function regulateMyOrder () {
  var element = event.target;
  var parent = element.parentNode.parentNode;
  var sign = element.textContent;

  var orderCount = parent.querySelector("#orderCount");
  var count = parseInt(orderCount.textContent);
  
  var orderPrice = parent.querySelector("#orderPrice");
  var price = parseInt(orderPrice.textContent.replace(/\s+/g, ""));
  var currentPrice = 0;

  price = price / count;

  if (sign == "+") {
    count++;
    orderCount.textContent = count;
  } else if (sign == "–" && count > 1) {
    count--;
    orderCount.textContent = count;
  }

  currentPrice = price * count;
  orderPrice.textContent = currentPrice.toLocaleString();
}

function makeMyOrder () {
  var element = event.target;
  var parent = element.parentNode;

  element.textContent = "В КОРЗИНЕ";
  parent.className = parent.className + " showcase__button_active";
  parent.disabled = "true";

  var div = parent.parentNode;
  var orderCount = div.querySelector("#orderCount");
  var orderPrice = div.querySelector("#orderPrice");

  var cartCounter = document.getElementById("cartCounter");
  var counter = parseInt(cartCounter.textContent);

  counter = counter + parseInt(orderCount.textContent);
  cartCounter.textContent = counter;

  sum = sum + parseInt(orderPrice.textContent.replace(/\s+/g, ""));
  summarizeMyOrder();

  save();
}

function switchThatTab (i) {
  var tab1 = document.getElementById("tabs__tab1");
  var tab2 = document.getElementById("tabs__tab2");

  var button1 = document.getElementById("tabs__button1");
  var button2 = document.getElementById("tabs__button2");

  if (i == 1) {
    tab2.style.display = "none";
    tab1.style.display = "block";

    button1.style.color = "#fd5a20";
    button2.style.color = "#acacac";
  } else {
    tab1.style.display = "none";
    tab2.style.display = "block";

    button2.style.color = "#fd5a20";
    button1.style.color = "#acacac";
  }
}

function coverThat () {
  var element = event.target;
  var parent = element.parentNode.parentNode;

  if (element.tagName == "div") {
    var image = parent.querySelector("img");
    var ul = parent.querySelector("ul");

    if (ul.className == "centered uncovered") {
      image.style.transform = "";
      ul.className = "covered";
    } else {
      image.style.transform = "scaleY(-1)";
      ul.className = "centered uncovered";
    } 
  } else {
    var image = parent.querySelector("img");
    var ul = parent.querySelector("ul");

    if (ul.className == "centered uncovered") {
      image.style.transform = "";
      ul.className = "covered";
    } else {
      image.style.transform = "scaleY(-1)";
      ul.className = "centered uncovered";
    }
  }
}

function uncoverThatText () {
  var element = event.target;
  var text = document.querySelector(".text__coverText");

  if (element.textContent == "ПОКАЗАТЬ ЕЩЕ") {
    text.style.display = "block"
    element.textContent = "СКРЫТЬ"
  } else {
    text.style.display = "none"
    element.textContent = "ПОКАЗАТЬ ЕЩЕ"
  }
}

var sum = 0;

function summarizeMyOrder () {
  var element = document.getElementById("cart");
  element.title = "Сумма: " + sum.toLocaleString() + " руб."
}

function onInit () {
  document.getElementById("tabs__button1").style.color = "#fd5a20";
  document.getElementById("tabs__tab2").style.display = "none";

  set();

  var mySwiper1 = new Swiper ('.s1', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
  
    autoplay: {
        delay: 2000,
    },
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  });
  
  var mySwiper2 = new Swiper ('.s2', {
    // Optional parameters
    direction: 'horizontal',
    loop: false,
    touchStartPreventDefault: false,
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
    },
  
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
    breakpoints: {
      1170: {
        slidesPerView: 4,
        slidesPerGroup: 5,
        spaceBetween: 40,
      },
  
      765: {
        slidesPerView: 3,
        slidesPerGroup: 5,
        spaceBetween: 30,
      },
  
      375: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 10,
      }
    }
  });
}

function save () {
  sessionStorage.setItem("html", document.body.innerHTML);
  sessionStorage.setItem("sum", sum);
}

function set () {
  var content = sessionStorage.getItem("html");
  if (content) {
    document.body.innerHTML = content;
  }
  
  var content2 = sessionStorage.getItem("sum");
  if (content2) {
    sum = sum + parseInt(content2);
  }
}

onInit();