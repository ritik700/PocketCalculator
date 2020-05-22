// BUDGET CONTROLLER
var budgetController = (function(){

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    //a datastructure
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }

    }

    return {
        addItem: function(typ, desc, val) {
            var newItem, ID;

            //create new ID
            if (data.allItems[typ].length > 0) {
                ID = data.allItems[typ][data.allItems[typ].length - 1].id + 1;
            } else {
                ID = 0;
            }
            if(typ === 'inc') {
                newItem = new Income(ID, desc, val);
            } else if(typ === 'exp') {
                newItem = new Expense(ID, desc, val);
            }

            data.allItems[typ].push(newItem);

            return newItem;

        },

        testing: function(){
            return console.log(data);
        }
    }

})();



//UI controller
var UICOntroller = (function(){

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputAdd: '.add__btn'

    }

    return {
        getInput: function() {

            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            }
            
        },
        getDomStrings: function() {
            return DOMStrings;
        }
    }
})();




//global controller
var controller = (function(bugtctrl, UICtrl){

    var setUpEventListener = function() {

        var DOM = UICtrl.getDomStrings();


        document.querySelector(DOM.inputAdd).addEventListener('click', ctrlAddItem);

        //when enter key pressed

        document.addEventListener('keypress', function(event){
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }

        });


    }


    var ctrlAddItem = function() {

        var input, newItem;
        //get input data
        input = UICtrl.getInput();

        //add item in budget controller
        newItem = bugtctrl.addItem(input.type, input.description, input.value);
        // add item to user interface
        //calculate the budget
        //display the budget

    }

    return {
        init: function() {
            setUpEventListener();
        }
    }

})(budgetController, UICOntroller);

controller.init()