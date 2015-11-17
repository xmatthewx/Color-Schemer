var scheme = null;


function generateColors() {
  var colors = scheme.colors();

  // palette with 4 colors
  colors = getPalette(colors);
  displayPalette(colors);
}


function displayPalette (colors){
  for (var i in colors) {
    var c = '#' + colors[i];
    var elem = $('.color' + i); 
    $('.copied').removeClass('copied');

    // apply color to swatch and demo
    elem.css('background-color', c);
    $('#demo .color' + i).css('color', c); // demo text

    // label swatch
    elem.find('span').html(c);

    // prep tap to copy hex
    $('#palette .color' + i).attr('data-clipboard-text',c);
  }
}


function slideHue(hue){
  scheme.from_hue(hue);
  var color = scheme.colors()[0];
  $('#hue-sample').css('color', '#' + color).css('background-color', '#' + color);
}

function setHue(hue) {
  scheme.from_hue(hue);
  generateColors();
}

function addComplement() { //@todo - this is broken

  var complementVal = $('#add-complement').attr();
  console.log(complementVal);

  if ( complementVal  ) {
    console.log('remove complement');
    scheme.add_complement(false);
  }
  else {
    scheme.add_complement(true);
    console.log('add complement');
  }
  generateColors();
}


function setDistance(distance) { // @todo - not currently in use
  scheme.distance(distance);
  generateColors();
  $('#distance-value').text(distance);
}

function setVariation(variation) {
  scheme.variation(variation);
  generateColors();
}

function setWebSafe(websafe) {
  scheme.web_safe(websafe);
  generateColors();
}

function randomHue() {
  var h = Math.round(Math.random() * 360);
  scheme.from_hue(h);
  generateColors();
}


function toggleActive (elem){
  var group = $(elem).parent();
  group.children('.active').removeClass('active');
  $(elem).toggleClass('active');
}


function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array; // rewrites origin
}


var colorSort = [0,1,2,3]; // color order in demo elements

function shuffleDemo(){
  var demo = $('#demo');
  var clones = [];
  shuffleArray(colorSort);

  var count = $( '#demo div' ).length; 
  var i = 0;

  for (i; i < count; i++) {
    var thisItem = $('#demo .color' + i);
    var newColor = colorSort[i];

    // change, clone and remove element to avoid hitting it again in loop
    thisItem.removeClass('color' + i).addClass('color' + newColor);
    clones.push( thisItem.clone() );
    thisItem.remove();

  };

  $('#demo').append(clones);

  generateColors();
  initDraggables(); // @todo - this is silly
}

function getPalette(colors){

  // color-scheme.js returns color arrays of different lengths depending on scheme type
  // getPalette() selects optimal 4 depending on type

  var count = colors.length; 
  var palette = [];

  if ( count === 4 ) { 
      palette = colors; 
  } else {
    palette.push(colors[0]);
    palette.push(colors[4]);
    switch (count) {
      case 8:
        palette.push(colors[2]);
        palette.push(colors[6]); /* omit for 3 color palette */
        break;
      case 12:
        palette.push(colors[8]);
        palette.push(colors[2]); /* omit for 3 color palette */
        break;
      case 16:
        palette.push(colors[8]);
        palette.push(colors[12]); /* omit for 3 color palette */
        break;
      default:
        console.log("Sorry. Something went wrong in Colorland.");
    };
  };
  return palette;
};


function setScheme(newScheme) {

  // switch not currently in use
  // needed for 'complement' and 'distance' selectors
  switch (newScheme) {
    case 'analogic' :
      // $('#add-complement').show();
      // $('#distance-selector').show();
      break;
    case 'tetrade' :
      // $('#distance-selector').show();
      $('#add-complement').hide();
      break;
    case 'triade' :
      // $('#distance-selector').show();
      $('#add-complement').hide();
      break;
    default :
      $('#add-complement').hide();
      $('#distance-selector').hide();
  };

  scheme.scheme(newScheme);
  generateColors();
}


function initDraggables(){

  var $draggables = $('.draggable').draggabilly({
    // contain to parent element
    containment: true
  });

  var top = 100;
  $draggables.on( 'dragStart', function( event, pointer ) {
    $(this).css('z-index',top);
    top += 1; 
  })

};


// handlers 

$(document).ready(function(){

  $('#scheme-selector').on('click', 'button', function(){
    var newScheme = this.getAttribute('data-schemetype');
    setScheme(newScheme);
  });

  $('#variation-selector').on('click', 'button', function(){
    var newVariation = this.getAttribute('data-schemeVariation');
    setVariation(newVariation);
  });

  $("#hue-slider").on('input', function(){
    slideHue(this.value)
    setHue(this.value)
  });
  
  $("#distance-slider").on('input', function(){
    setDistance(this.value)
  });

  $('#add-complement').click(addComplement); // @todo change button to checkbox

  $('#demo .shuffle').on('click',shuffleDemo);

  $('button').on('click', function(){
    toggleActive(this);
  });


  // draggables

  initDraggables();
  var $draggables = $('.draggable').draggabilly({
    // contain to parent element
    containment: true
  });

  var top = 100;
  $draggables.on( 'dragStart', function( event, pointer ) {
    $(this).css('z-index',top);
    top += 1; 
  })

  // tap to copy to clipboard

  var client = new ZeroClipboard($('.copy'));

  client.on( 'ready', function( readyEvent ) {
    $('#palette .helper').show();
    client.on( 'aftercopy', function( event ) {
      event.target.classList.add('copied');
    });
  });

  // initial colors

  scheme = new ColorScheme;
  slideHue(120);
  setHue(120);
  scheme.scheme('triade');
  scheme.variation('pastel');
  generateColors();


}); // $(document).ready(...)
