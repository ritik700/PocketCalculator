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
    };

    var calculateTotal = function(type) {

        var sum = 0;
        data.allItems[type].forEach(function(c, i, a) {
            sum += c.value;
        });

        data.totals[type] = sum;

    };

    //a datastructure
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1

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
        },

        calculateBudget: function(){

            calculateTotal('inc');
            calculateTotal('exp');

            data.budget = data.totals.inc - data.totals.exp;

            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);  
            } else {
                data.percentage = -1;
            }
            //calc total income and expenses

        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpense: data.totals.exp,
                percent: data.percentage
            }
        }
    }

})();



//UI controller
var UICOntroller = (function(){

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputAdd: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'

    }

    return {
        getInput: function() {

            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
            
        },

        getDomStrings: function() {
            return DOMStrings;
        },

        clearFields: function() {
            var fields, fieldArr;
            //this will return list
            fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);


            fieldArr = Array.prototype.slice.call(fields);
            fieldArr.forEach(function(current, index, array){
                current.value = "";
            });
            fieldArr[0].focus();
        },

        addListIetm: function(obj, type) {
            var html, newHtml, element;

            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === 'exp') {
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div><div></div>';
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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

    var updateBudget = function() {
        //calculate the budget
        //display the budget
        bugtctrl.calculateBudget();

        var budget = bugtctrl.getBudget();

        console.log(budget);

    };




    var ctrlAddItem = function() {

        var input, newItem;
        //get input data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //add item in budget controller

            newItem = bugtctrl.addItem(input.type, input.description, input.value);

            // add item to user interface
            UICtrl.addListIetm(newItem, input.type);
            UICtrl.clearFields();

            updateBudget();

        }
    }

    return {
        init: function() {
            setUpEventListener();
        }
    }

})(budgetController, UICOntroller);

controller.init()