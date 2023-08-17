//Using querySelector() ith custom attribute
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");

//Using querySelectorAll() to get all the input tags having atrribute type = "checkbox"
const allCheckBox = document.querySelectorAll("input[type=checkbox]");


//initially required
let password = "";
let passwordLength = 10;
let checkCount = 0;

//to make the slider point to 10 at the beginning
handleSlider();
//string containing all the symbols for generating random symbol
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';



//set default strength circle color to grey
setIndicator("#ccc");



//set passwordLength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;


    //separating the left and right side of slider thumb
    const min = inputSlider.min;
    const max = inputSlider.max;

    inputSlider.style.backgroundSize = ((passwordLength - min) *100 / (max-min)) + "% 100%"
}




//sets the color and shadow of the circle according to the password strength
function setIndicator(color) {
    
    //setting the background color of strength area
    indicator.style.backgroundColor = color;
    //Adding shadow using box-shadow property
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}



function getRndInteger(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}


//Working on ASCII values --> 97 --> a  and 122 --> z
function generateLowerCase() {
    let character_no = getRndInteger(97,123);   //excludes last no.
    return String.fromCharCode(character_no);

}

//Working on ASCII values  --> 65 --> A  and 91 --> Z
function generateUpperCase() {
    let character_no = getRndInteger(65,91);    //excludes last no.
    return String.fromCharCode(character_no);
}


//Since we dont know the ASCII values for symbols , hence put all the symbols in the keyboard in a string and then randomly select them using indexes.
function generateSymbol(){

    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}




//RULES FOR DECIDING PASSWORD's STRENGTH
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;


    if(uppercaseCheck.checked) 
        hasUpper = true;
    if(lowercaseCheck.checked)
        hasLower = true;
    if(numbersCheck.checked)
        hasNum = true;
    if(symbolsCheck.checked)
        hasSym = true;

        if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) { 
            //setting color of circle
            setIndicator("#0f0");
          } 
        else if (
            (hasLower || hasUpper) &&
            (hasNum || hasSym) &&
            passwordLength >= 6
          ) 
          {
            setIndicator("#ff0");
          } 
        else {
            setIndicator("#f00");
          }
}





// await navigator.clipboard.writeText(passwordDisplay.value)  is a statement that uses the Clipboard API to write the generated password to the clipboard

// The writeText() method of the Clipboard interface writes the provided text to the clipboard. It returns a Promise that  resolves when the text has been successfully written to the clipboard.

//By using the "await" keyword before the navigator.clipboard.writeText(passwordDisplay.value) statement, the code waits until the Promise resolves before moving on to the next line of code. This ensures that the password is successfully written to the clipboard before any further actions are taken.
//Hence since it is an asynchronous function hence we dont want that our copied text is shown before and then after some time the text is copied to clipboard
// Both things should happen simultaneously that is first the text should get copied to clipboard and then the copied text should appear, hence we use async-await


//use async for await to work
async function copyContent() {

    try{
        await navigator.clipboard.writeText(passwordDisplay.value)
        copyMsg.innerText = "Copied";
    }
    catch(e)
    {
        copyMsg.innerText = "Failed";
    }

    // to make the copy text span visible
    copyMsg.classList.add("active");
    
    //to make the copy text invisible after sometime
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}








//********************************************************************************************************************************************************************************************************** */
//Now there are four event listeners clearly visible
// a) on slider
// b) on copy button
// c) generate button
// d) checkboxes --> to update the count of ticked checkboxes (see the eventListener on generate button)

// TAKING VALUE FROM SLIDER
//Hence adding event listener on slider
//Event --> anything that we input on slider
inputSlider.addEventListener("input",(e)=>{
    passwordLength = e.target.value;     //remember to use passwordLength else we wont be able to use the slider only
    handleSlider();
})



//TAKING VALUE FROM PASSWORD INPUT TO COPY
//Hence adding event listener on copy button
//Event --> anytime we click on copy button
copyBtn.addEventListener("click",()=>{
    if(passwordDisplay.value)
    {
        copyContent();
    }
})
//means when the password readonly input field is not empty then only the text can be copied to clipboard and the copyied text can appear, else it won't appear hence we check if it is empty or not, if not empty then only we copy the content

//or we can use if final_password.length > 0 then only copy






//Creating RANDOM PASSWORD WHEN THE GENERATE BUTTON IS CLICKED
//Hence adding event listener on generate button
//Event --> anytime we click on copy button

generateBtn.addEventListener("click",()=>{
    //Atleast one checkbox should be ticked to create a password
    //else we cannot create and copy password
    //for that we have to track the count of ticked checkboxes
    // for that we have to put an event listener on every checkbox to update count

    //none of the checkbox is selected
    if(checkCount == 0)
    return;

    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }


    //lets find the new password

    // Step 1 --> remove old password;
    password = "";

    // Step 2 --> put all the required field (ticked check boxes)first in the password 


    /*
        if(uppercaseCheck.checked)
        {
            password += generateUpperCase();
        }
        if(lowercaseCheck.checked)
        {
            password += generateLowerCase();
        }
        if(numbersCheck.checked)
        {
            password += generateRandomNumber();
        }
        if(symbolsCheck.checked)
        {
            password += generateSymbol();
        }
    */

    //Step 3 --> filling all the remaining leftover places randomly
    //hence we need an array where we will store all the functions which are checked and randomly select those using indexes.
    

    //Optimization :-
    //hence we dont need to do STEP-2 as they will always come in specific order, we can just put all the functions in an array which are checked directly and then first put all the letters that are checked first and then fill the remaining length by randomly selecting functions from that array by randomly selecting indexes.

    
    let funcArr = [];
        
        //adding only the ticked functions
        if(uppercaseCheck.checked)
        {
            funcArr.push(generateUpperCase);
        }
        if(lowercaseCheck.checked)
        {
            funcArr.push(generateLowerCase);
        }
        if(numbersCheck.checked)
        {
            funcArr.push(generateRandomNumber);
        }
        if(symbolsCheck.checked)
        {
            funcArr.push(generateSymbol);
        }


        //compulsary addition of letters according to ticked checkboxes       
        for (let i = 0; i < funcArr.length; i++) {
           
            //Adding braces is necessary as we are just putting function names inside array and hence inorder to call them we must 
            password += funcArr[i]();
        }


         //remaining addition of letters according to ticked checkboxes
          for (let i = 0; i < passwordLength - funcArr.length; i++) {
                let randIndex = getRndInteger(0,funcArr.length);
                password += funcArr[randIndex]();
          }



          //At last shuffling all the letters in the password
          password = shufflePassword(Array.from(password));
          


          //At last showing the password in UI
          passwordDisplay.value = password;


          //calculating the strength by changing the color of the circle
          calcStrength();

          
})



function shufflePassword(array){

    //Fisher Yates Method

    //travelling from back to front
    for(let i = array.length - 1; i > 0 ; i--)
    {

         //finding random index between current i from back and 0
        const j = Math.floor(Math.random() * (i+1));
        
        //swapping the ith index no. with random index no.(j)
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }


    //adding the elements of array in the string
    let str = "";
    array.forEach((el)=> str+=el);
    return str;


}


//allCheckBox gives an array-like object of all the checkboxes as it was given by querySelectorALL
//hence we go to all checkboxes and put an event listener usinf for-each loop instead of fetching and applying on them one by one

allCheckBox.forEach((checkbox)=>{

    //Event --> any change (from tick to untick and from untick to tick)
    checkbox.addEventListener("change",handleCheckBoxChange);
});


//whenever we find a change in checkboxes --> tick or untick, we count the no. of ticked checkboxes from the starting and update the count
//instead we can use if-else to check if the change is ticked or unticked
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });
    
    
    //Corner Case:-
    //that if we ticked four checkboxes but got the slider length to 1, still the password should comprise of 4 letters and the slidr should itself come to 4
    // i.e if passwordLength got less than checkCount then update the passwordLength such that the slider updates automatically using hendleSlider function
    if(passwordLength < checkCount)
    {
      passwordLength = checkCount;  
      handleSlider(); 
    }
}




