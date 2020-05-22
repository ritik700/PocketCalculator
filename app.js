// BUDGET CONTROLLER
var budgetController = (function(){

})();

//UI controller
var UICOntroller = (function(){

})();





//global controller
var controller = (function(bugtctrl, UICtrl){
    var ctrlAddItem = function() {
        //get input data
        //add item in budget controller
        // add item to user interface
        //calculate the budget
        //display the budget

    }
    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    //when enter key pressed

    document.addEventListener('keypress', function(event){
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }

    });

})(budgetController, UICOntroller);