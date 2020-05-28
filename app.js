// BUDGET CONTROLLER
var budgetController = (function(){

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }

    Expense.prototype.calcPercent = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value/totalIncome) * 100);
        } else {
            this.percentage  = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
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

        deleteItem: function(type, id) {
            // data.allItems[type][id];

            var ids, index;
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                //position and how many number to delete
                data.allItems[type].splice(index, 1);
            }

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

        calculatePercentage: function() {
            data.allItems.exp.forEach(function(curr, ind, array) {
                curr.calcPercent(data.totals.inc);
            });
        },

        getPercentages: function() {
            var allPercentage = data.allItems.exp.map(function(curr) {
                return curr.getPercentage();
            })

            return allPercentage;
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        budgetIncome: '.budget__income--value',
        budgetExpenses: '.budget__expenses--value',
        budgetExpPercentage: '.budget__expenses--percentage',
        container: '.container',
        'expensesPercent': '.item__percentage',
        'dateLabel': '.budget__title--month'

    }

    var formatNumber = function(num, type) {
        var numSplit;
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    var nodeListForeach = function(list, callback) {
        for(var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

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
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === 'exp') {
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div><div></div>';
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

        },

        displayBudget: function(obj) {

            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.budgetIncome).textContent = formatNumber(obj.totalIncome, 'inc');
            document.querySelector(DOMStrings.budgetExpenses).textContent = formatNumber(obj.totalExpense, 'exp');

            if (obj.percent > 0) {
                document.querySelector(DOMStrings.budgetExpPercentage).textContent = obj.percent + '%';
            } else {
                document.querySelector(DOMStrings.budgetExpPercentage).textContent = '----';
            }

        },

        displayPercentage: function(percentage) {
            var fields = document.querySelectorAll(DOMStrings.expensesPercent);

            

            nodeListForeach(fields, function(curr, ind) {
                if (percentage[ind] > 0) {
                    curr.textContent = percentage[ind] + '%';
                } else {
                    curr.textContent = '---';
                }
            });
        },

        displayMonth: function() {
            var now, year, months, month;
            now = new Date();
            months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October","November", "December"];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] +" "+year;
        },

        changeType: function() {
            var fields = document.querySelectorAll(DOMStrings.inputType +','+ DOMStrings.inputDescription +','+
                DOMStrings.inputValue
            )
            document.querySelector(DOMStrings.inputAdd).classList.toggle('red');
            nodeListForeach(fields, function(curr) {
                curr.classList.toggle('red-focus');
            });
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

        document.querySelector(DOM.container).addEventListener('click', ctrDelItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);

    }

    var ctrDelItem = function(event) {
        var itemId, splitID, type, ID;

        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemId) {
            splitID = itemId.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            bugtctrl.deleteItem(type, ID);

            UICtrl.deleteListItem(itemId);

            updateBudget();

            updatePercentage();

        }
    }

    var updateBudget = function() {
        //calculate the budget
        //display the budget
        bugtctrl.calculateBudget();

        var budget = bugtctrl.getBudget();

        UICtrl.displayBudget(budget);

    };

    var updatePercentage = function() {

        bugtctrl.calculatePercentage();
    
        var percentages = bugtctrl.getPercentages();

        UICtrl.displayPercentage(percentages);
        //update the UI with new percentage
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

            updatePercentage();


        }
    }

    return {
        init: function() {
            var budget = {budget: 0,
                totalIncome: 0,
                totalExpense: 0,
                percent: 0}
            UICtrl.displayBudget(budget);
            UICtrl.displayMonth();
            setUpEventListener();
        }
    }

})(budgetController, UICOntroller);

controller.init()