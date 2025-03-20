// Original page scroll code
var page = document.getElementById('page');
var sections = page.getElementsByTagName('section');
var transition = 'top .8s cubic-bezier(0.77, 0, 0.175, 1)';
page.style.transition = transition;
page.onclick = slideDown;

function slideDown(e) {
  if (e.target.className != 'next') {
    return;
  }
  
  page.onclick = '';
  self = e.target.parentNode;
  var offset = self.getBoundingClientRect();
  var scroll = self.offsetTop;

  page.style.top = (-offset.height-offset.top) + 'px';

  setTimeout(function () {
    page.style.transition = 'none';
    page.style.top = '';
    window.scrollTo(0, offset.height+scroll);
    page.style.transition = transition;
    page.onclick = slideDown;
  }, 800);
}

// Rotating text animation
let words = document.querySelectorAll(".word");
words.forEach(word => {
  let letters = word.textContent.split("");
  word.textContent = "";
  letters.forEach(letter => {
    let span = document.createElement("span");
    span.textContent = letter;
    span.className = "letter";
    word.append(span);
  });
});

let currentWordIndex = 0;
let maxWordIndex = words.length - 1;
words[currentWordIndex].style.opacity = "1";

let rotateText = () => {
  let currentWord = words[currentWordIndex];
  let nextWord =
    currentWordIndex === maxWordIndex ? words[0] : words[currentWordIndex + 1];
  
  Array.from(currentWord.children).forEach((letter, i) => {
    setTimeout(() => {
      letter.className = "letter out";
    }, i * 80);
  });
  
  nextWord.style.opacity = "1";
  Array.from(nextWord.children).forEach((letter, i) => {
    letter.className = "letter behind";
    setTimeout(() => {
      letter.className = "letter in";
    }, 340 + i * 80);
  });
  
  currentWordIndex =
    currentWordIndex === maxWordIndex ? 0 : currentWordIndex + 1;
};

// Initialize rotating text
document.addEventListener('DOMContentLoaded', function() {
  // Initial rotation
  setTimeout(rotateText, 1000);
  // Set interval for continuous rotation
  setInterval(rotateText, 4000);
});

// BUBBLE ANIMATION - FIXED VERSION
'use strict';

// Initialize bubble variables
var maxBubbles = 15;
var container = document.querySelector('.bubble');
var containerWidth = container.clientWidth;
var containerHeight = container.clientHeight;
var content = document.querySelector('.bubble_content');

// Make sure we have the required GSAP objects
var TweenLite = window.TweenLite || window.gsap;
var TimelineLite = window.TimelineLite || window.gsap;
var Power1 = window.Power1 || { easeOut: 'power1.out' };
var SlowMo = window.SlowMo || { easeInOut: 'slow' };

var bubbles = [];

var minX = 0;
var minY = 0;

var baseShapeSize = 200;
var minShapeSize = 50;

var time = 7;
var minTime = 4;

function Bubble() {
    // Clone the template bubble
    this.bubble = document.querySelector('.svg.bubble').cloneNode(true);
    
    // Make all shapes inside the bubble visible
    var shapes = this.bubble.querySelectorAll('.shape._hidden');
    for (var i = 0; i < shapes.length; i++) {
        shapes[i].classList.remove('_hidden');
    }
    
    this.setSize();
    this.setPos();
    
    // Add bubble to the DOM
    content.appendChild(this.bubble);
    
    this.content = this.bubble.querySelector('.bubble__group');
    this.splash = this.bubble.querySelector('.bubble__splash');
    this.isCollapsed = false;
    
    var that = this;
    this.bubble.onclick = function() {
        if (!that.isCollapsed) {
            that.isCollapsed = true;
            that.collapse();
        }
    };
    
    this.addAnimation();
}

Bubble.prototype.collapse = function() {
    var that = this;
    
    function resetBubble() {
        var tl = new TimelineLite();
        that.setSize();
        that.setPos();

        tl.to(that.content, 0.3, {
            scale: 1,
            opacity: 1,
            delay: 2,
            onComplete: function() { 
                that.isCollapsed = false; 
            }
        });
    }
    
    var tl = new TimelineLite();
    tl.set(this.content, {
        scale: 0,
        transformOrigin: '100px 100px',
        opacity: 0
    });
    tl.set(this.splash, {
        scale: 0.5,
        transformOrigin: '100px 100px',
        opacity: 1
    });
    tl.to(this.splash, 0.15, {
        scale: 1.5,
        opacity: 0,
        ease: Power1.easeOut,
        onComplete: resetBubble
    });
};

Bubble.prototype.setPos = function() {
    var target = this.getSide();
    this.bubble.style.transform = 'translate3d(' + target.coords.x + 'px, ' + target.coords.y + 'px, 0)';
    this.side = target.side; // Save the current side
};

Bubble.prototype.setSize = function() {
    this.shapeSize = Math.round(Math.random() * (baseShapeSize - minShapeSize)) + minShapeSize;
    this.bubble.style.width = this.shapeSize + 'px';   
    this.bubble.style.height = this.shapeSize + 'px';   
    
    this.maxX = containerWidth - this.shapeSize;
    this.maxY = containerHeight - this.shapeSize;
};

Bubble.prototype.addAnimation = function() {
    var newTime = Math.random() * time + minTime;
    var elem = this.bubble;
    var delay = Math.random() * time;
    var tl = new TimelineLite();
    var that = this;
    
    animate();
    
    function animate() {
        var target = that.getSide(that.side);
        that.side = target.side;
        var propSet = { 
            x: target.coords.x,
            y: target.coords.y,
            ease: SlowMo.easeInOut,
            delay: delay,
            onComplete: animate
        };        
        tl.to(elem, newTime, propSet);
        
        if (delay) {
            delay = 0;
        }
    }   
};

Bubble.prototype.getSide = function() {
    var targetParams = {
        side: '',
        coords: {}
    };
    var maxRandX = Math.round(Math.random() * this.maxX);
    var maxRandY = Math.round(Math.random() * this.maxY);
    
    var sides = {
        'top': { 
            x: maxRandX, 
            y: minY 
        },
        'right': { 
            x: this.maxX, 
            y: maxRandY 
        },
        'bottom': { 
            x: maxRandX, 
            y: this.maxY 
        },
        'left': { 
            x: minX, 
            y: maxRandY 
        }
    };
        
    // Don't go back to the same side
    if (this.side) {
        delete sides[this.side];
    }
    
    var keys = Object.keys(sides);    
    var randPos = Math.floor(Math.random() * keys.length);
    var newSide = keys[randPos];    
    
    targetParams.side = newSide;
    targetParams.coords = sides[newSide];
    
    return targetParams;
};

// Create all bubbles
function initBubbles() {
    // First unhide the template
    document.querySelector('.demo__defs').classList.remove('hidden');
    
    // Create bubbles
    for (var i = 0; i < maxBubbles; i++) {
        var bubble = new Bubble();
        bubbles.push(bubble);
    }
}

// Make sure DOM is loaded before initializing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Small delay to ensure everything is rendered
        setTimeout(initBubbles, 500);
    });
} else {
    // DOM already loaded
    setTimeout(initBubbles, 500);
}

// Update bubble positions on window resize
window.addEventListener('resize', function() {
    containerWidth = container.clientWidth;
    containerHeight = container.clientHeight;
    
    bubbles.forEach(function(item) {
        item.maxX = containerWidth - item.shapeSize;
        item.maxY = containerHeight - item.shapeSize;
    });
});

//cursor

let curs = document.querySelector('.cursor');

document.addEventListener('mousemove', (e) => {
  let x = e.pageX;
  let y = e.pageY;
  curs.style.left = (x - 20) + "px";
  curs.style.top = (y - 20) + "px";
  curs.style.opacity = "1"
});

document.addEventListener('click', (e) => {
  curs.style.transform.translate = "scale(1.2)"
});
