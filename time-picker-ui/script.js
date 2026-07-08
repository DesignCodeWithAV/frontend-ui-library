//==========================================
// Elements
//==========================================

const pickerInput = document.getElementById("pickerInput");

const dropdown = document.getElementById("dropdown");

const hourWheel = document.getElementById("hourWheel");

const minuteWheel = document.getElementById("minuteWheel");

const selectedHour = document.getElementById("selectedHour");

const selectedMinute = document.getElementById("selectedMinute");

const selectedPeriod = document.getElementById("selectedPeriod");

const nowBtn = document.getElementById("nowBtn");

const doneBtn = document.getElementById("doneBtn");

const cancelBtn = document.getElementById("cancelBtn");

const periodBtns = document.querySelectorAll(".period-btn");
//==========================================
// State
//==========================================

let hour = "01";

let minute = "00";

let period = "AM";

let tempHour = hour;
let tempMinute = minute;
let tempPeriod = period;
//==========================================
// Create Wheel Item
//==========================================

function createItem(value){

    const div = document.createElement("div");

    div.className = "wheel-item";

    div.innerText = value;

    return div;

}

//==========================================
// Scroll To Center
//==========================================

function scrollToCenter(container,item){

    const top =
        item.offsetTop -
        (container.clientHeight / 2) +
        (item.offsetHeight / 2);

    container.scrollTo({

        top,

        behavior:"smooth"

    });

}
//==========================================
// Generate Hours
//==========================================

for(let i=1;i<=12;i++){

    let value = i.toString().padStart(2,"0");

    hourWheel.appendChild(createItem(value));

}


//==========================================
// Generate Minutes
//==========================================

for(let i=0;i<60;i++){

    let value = i.toString().padStart(2,"0");

    minuteWheel.appendChild(createItem(value));

}


//==========================================
// Active Item
//==========================================

function setActive(wheel,value){

    [...wheel.children].forEach(item=>{

        item.classList.remove("active");

        if(item.innerText===value){

            item.classList.add("active");

            scrollToCenter(wheel,item);

        }

    });

}

setActive(hourWheel,hour);

setActive(minuteWheel,minute);



//==========================================
// Update Input
//==========================================

function updateInput(){

    selectedHour.innerText = hour;

    selectedMinute.innerText = minute;

    selectedPeriod.innerText = period;

}


//==========================================
// Open
//==========================================

pickerInput.onclick = ()=>{

    tempHour = hour;
    tempMinute = minute;
    tempPeriod = period;

    dropdown.classList.add("show");

    pickerInput.classList.add("active");

};


//==========================================
// Close
//==========================================

function closePicker(){

    dropdown.classList.remove("show");

    pickerInput.classList.remove("active");

}


//==========================================
// Select Item
//==========================================

function bindWheel(wheel,type){

    [...wheel.children].forEach(item=>{

        item.onclick = ()=>{

            [...wheel.children].forEach(x=>{

                x.classList.remove("active");

            });

            item.classList.add("active");

            if(type==="hour"){

                hour=item.innerText;

            }

            if(type==="minute"){

                minute=item.innerText;

            }

            if(type==="period"){

                period=item.innerText;

            }

        };

    });

}

bindWheel(hourWheel,"hour");

bindWheel(minuteWheel,"minute");

periodBtns.forEach(btn=>{

    btn.onclick = ()=>{

        periodBtns.forEach(item=>{

            item.classList.remove("active");

        });

        btn.classList.add("active");

        period = btn.dataset.period;

    };

});

//==========================================
// Done Button
//==========================================

doneBtn.addEventListener("click",()=>{

    updateInput();

    closePicker();

});


//==========================================
// Cancel Button
//==========================================

cancelBtn.addEventListener("click",()=>{

    hour = tempHour;
    minute = tempMinute;
    period = tempPeriod;

    setActive(hourWheel,hour);
    setActive(minuteWheel,minute);

    periodBtns.forEach(btn=>{

        btn.classList.toggle(
            "active",
            btn.dataset.period===period
        );

    });

    updateInput();

    closePicker();

});


//==========================================
// Current Time
//==========================================

nowBtn.addEventListener("click",()=>{

    const now = new Date();

    let h = now.getHours();

    period = h >= 12 ? "PM" : "AM";

    h = h % 12;

    if(h===0){

        h = 12;

    }

    hour = h.toString().padStart(2,"0");

    minute = now
        .getMinutes()
        .toString()
        .padStart(2,"0");

    setActive(hourWheel,hour);

    setActive(minuteWheel,minute);

    periodBtns.forEach(btn=>{

        btn.classList.toggle(

            "active",

            btn.dataset.period===period

        );

    });

});


//==========================================
// Outside Click
//==========================================

document.addEventListener("click",(e)=>{

    if(!e.target.closest(".time-picker")){

        closePicker();

    }

});


//==========================================
// Mouse Wheel Support
//==========================================

function wheelScroll(container,type){

    container.addEventListener("wheel",(e)=>{

        e.preventDefault();

        let active = container.querySelector(".active");

        let next;

        if(e.deltaY>0){

            next = active.nextElementSibling;

        }

        else{

            next = active.previousElementSibling;

        }

        if(!next){

            return;

        }

        active.classList.remove("active");

        next.classList.add("active");

        scrollToCenter(container,next);

        if(type==="hour"){

            hour = next.innerText;

        }

        if(type==="minute"){

            minute = next.innerText;

        }

        if(type==="period"){

            period = next.innerText;

        }

    });

}

wheelScroll(hourWheel,"hour");

wheelScroll(minuteWheel,"minute");


//==========================================
// Keyboard
//==========================================

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        closePicker();

    }

    if(e.key==="Enter"){

        updateInput();

        closePicker();

    }

});


//==========================================
// Default Value
//==========================================

updateInput();