/********/
/* MENU */
/********/


var colors = {
    "good": "#096",
    "moderate": "#ffde330",
    "unhealtylow": "#ff9933",
    "unhealtymedium": "#c03",
    "veryunhealty": "#609",
    "hazardous": "#7e0023"
}
var bg_color;
var font_value;

/* Richiesta ad API ed elaborazione risposta */
async function get_aqi_data() {
    let data = await fetch("https://api.waqi.info/feed/here/?token=a5bcabdf37b376ee2eafa3f7c72b49ea520ddc69");
    let response = await data.json();
    console.log(response.data)
    if (response.data.aqi >= 0 && response.data.aqi < 50) {
        bg_color = colors.good
    } else if (response.data.aqi >= 50 && response.data.aqi < 100) {
        bg_color = colors.moderate
    } else if (response.data.aqi >= 100 && response.data.aqi < 150) {
        bg_color = colors.unhealtylow
    } else if (response.data.aqi >= 150 && response.data.aqi < 200) {
        bg_color = colors.unhealtymedium
    } else if (response.data.aqi >= 200 && response.data.aqi < 300) {
        bg_color = colors.veryunhealty
    } else if (response.data.aqi >= 300) {
        bg_color = colors.hazardous
        response.data.aqi = 300
    }
    populate('aqi', response.data.aqi);

    change_smile_mood(response.data.aqi);

    for (const element in response.data.iaqi) {
        populate(element, response.data.iaqi[element].v);
    }

    font_value = parseInt((response.data.aqi).map(0, 300, 0, 100));

    new_font_face(font_value);
}

function new_font_face(font_value) {

    console.log("This site is using the Anthropocene font, find more about it http://anthropoceneotf.org")
    console.log("Your current AQI (Air  Quality Index) is " + font_value + ", read more about it here https://aqicn.org/faq/")
    var new_face = document.createElement('style');
    new_face.appendChild(document.createTextNode("\
	@font-face {\
		font-family: 'Anthropocene';\
		src: url('./cdn/fonts/Anthropocene-" + font_value + ".otf');\
}\
"));
    document.head.appendChild(new_face);

    let root = document.documentElement
    root.style.setProperty("--main-color", /*bg_color*/ "#0b24fb")

    display_page();
}

function display_page() {
    document.body.classList.add("show");
}

/* Popola valori qualità dell'aria su menù */
async function populate(element, elementValue) {
    try {
        document.getElementById(element).innerHTML = element.toUpperCase() + " - " + elementValue;
    } catch (e) {}
}

/* Rimappiamo il valore della qualità dell'aria e modifichiamo la curva del sorriso */
async function change_smile_mood(current_value) {
    current_value = parseInt(current_value);
    let max_happy_value = 210;
    let max_sad_value = 90;
    let value = current_value.map(0, 300, max_happy_value, max_sad_value);
    //let path = document.getElementById("smile_path").getAttribute('d');
    //let modified_path = path.split(" ");
    //modified_path[7] = value;
    //document.getElementById("smile_path").setAttribute('d', modified_path.join(" "));
}


/* Aspetta il documento prima di esegure le funzioni */
document.addEventListener("DOMContentLoaded", function(event) {
    get_aqi_data();
    $("body").on("click", function() {
        $("#sky-resp")[0].autoplay = true
    })
});





/******************************************************************/
/************/
/* DOWNLOAD */
/************/

function download_font() {
    window.location = "./font_source/Anthropocene00-" + font_value + ".otf";
}

function set_download_link() {
    console.log("download")
    $("#download-bold").attr("href","../cdn/fonts/Anthropocene-1.otf")
    $("#download-thin").attr("href","../cdn/fonts/Anthropocene-100.otf")
    $("#download-aqi").attr("href", "cdn/fonts/Anthropocene-" + font_value + ".otf")
}


/******************************************************************/
/***********/
/* HELPERS */
/***********/

/* Helper per caricare le pagine nella sezione content */
function load_page(page) {
    $(".link").removeClass("active")
    $("#" + page + "-link").addClass("active")
    $(".content").animate({ scrollTop: 0 }, "slow");
    switch (page) {
        case "showcase":
            $("#content").load("./pages/showcase.html", function() {
                load_entries()
            });
            break;
        case "main":
            $("#content").load("./pages/main.html", function() {});
            break;
        case "about":
            $("#content").load("./pages/about.html", function() {});
            break;
        case "concept":
            $("#content").load("./pages/concept.html", function() {});
            break;
        case "submit":
            $("#content").load("./pages/submit.html", function() {});
            break;
        case "get-started":
            $("#content").load("./pages/get-started.html", function() {});
            break;
        case "download":
            let mouseIsDown = false;
            $("#content").load("./pages/download.html", function() {
                set_download_link()
                $('#font-playground-size-range').on('mousedown', function(event) {
                    console.log(mouseIsDown)
                    mouseIsDown = true
                    if (mouseIsDown) {
                        mouseIsDown = setInterval(function(){changeFontSize(event.target.value)}, 100 /*execute every 100ms*/);
                    }
                    
                });
                $('#font-playground-size-range').on('touchstart', function(event) {
                    console.log(mouseIsDown)
                    mouseIsDown = true
                    if (mouseIsDown) {
                        mouseIsDown = setInterval(function(){changeFontSize(event.target.value)}, 100 /*execute every 100ms*/);
                    }
                    
                });

                $('#font-playground-size-range').on('mouseup', function(event) {

                    if (mouseIsDown != false) {
                       clearInterval(mouseIsDown)
                       mouseIsDown = false
                    }

                });
                $('#font-playground-size-range').on('touchend', function(event) {

                    if (mouseIsDown != false) {
                       clearInterval(mouseIsDown)
                       mouseIsDown = false
                    }

                });

                $(".font-playground-weight-selector>label").click(function(){
                    $(".font-playground-weight-selector>label p").css("border-bottom","0")
                    $("."+$(this).attr('class')+" p").css("border-bottom","1px solid")
                        switch ($(this).attr('class')) {
                            case "font-playground-bold-select":
                                $("#font-tryout").css("font-family","a-bold")
                                break;
                            case "font-playground-thin-select":
                                $("#font-tryout").css("font-family","a-thin");
                                break;
                            case "font-playground-aqi-select":
                                $("#font-tryout").css("font-family","Anthropocene");
                                break;
                            default:
                        }

                })

            });
            break;
        default:
    }

    if ($("#resp-menu-toggler").is(":visible")) {
        toggleMenu();
    }
}


/* Helper per creare div con classi e testo all'interno */
function create_div(className) {
    let div = document.createElement("div");
    if (className != undefined) {
        for (var key in className) {
            switch (key) {
                case "class":
                    div.classList.add(className[key]);
                    break;
                case "text":
                    let text = document.createTextNode(className[key]);
                    div.appendChild(text);
                    break;
            }
        }

    }
    return div;
}

/* funzione per mostrare il menu responsive */

let openMenu = false;

function toggleMenu() {
    if (!openMenu) {
        $("#menu").css("transform", "translateX(0)")
        openMenu = !openMenu
    } else {
        $("#menu").css("transform", "translateX(-100%)")
        openMenu = !openMenu
    }
}

/* Helper prototype per rimappare i valori */
Number.prototype.map = function(in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

/* Playground */

function changeFontSize(val){
    //console.log(val);
    $('#font-tryout').css("font-size",val+"em");
}

function changeColorTextarea(color) {
    switch (color) {
        case 'white':
            $("#font-tryout").css("background-color","white")
            $("#font-tryout").css("color","black");
            break;
        case 'blue':
            $("#font-tryout").css("background-color","transparent")
            $("#font-tryout").css("color","white");
            break;
        case 'black':
            $("#font-tryout").css("background-color","black")
            $("#font-tryout").css("color","white");
            break;
    }
}

function scrollToDownload() {
    $(".content").animate({ scrollTop: $(".download-section").position().top }, "slow");
}