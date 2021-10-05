const toggle = document.getElementsByClassName("widget")[0];

toggle.addEventListener("click", toggleWidget);

function toggleWidget() {
    console.log("close widget");
    var container = document.getElementsByClassName('container')[0];
    // container.style.display = "none"; 
    
   const CustomerDetails = AB_config.callbacks.getCustomerDetails();
   console.log(CustomerDetails);
    
    console.log(container.classList.contains('active'));

    if(container.classList.contains('active')) {
        AB_config.callbacks.onHideWidget();
        container.classList.remove('active')
    } else {
        AB_config.callbacks.onShowWidget();
        container.classList.add('active')
    }
}

//  window.addEventListener('load', setTimeout(() => {
//     init();
//  }, 3000));

window.addEventListener('load', init);

function init() {

    const customerDetails = AB_config.callbacks.onWidgetReady();

    console.log("@@", customerDetails.accId,customerDetails.customer);

    console.log("accdetails", AB_config);    
    let accId = customerDetails.accId;
    let customer = customerDetails.customer;
    console.log(customer.name, customer.email);

    var query = Object.keys(customer).map( key => key+ '='+ customer[key]).join('&&');
    console.log(`http://localhost:5000/changelog/widget
    ?accId=${accId}&&${query}`);

    fetch(`http://localhost:5000/changelog/widget?accId=${accId}&&${query}`)
    .then((result) => result.json())
    .then((data) => {
        var changes = data;
        fetchChangeLog(changes);
    })
    .catch((err) => {
        console.log(err);
    });
}

    function fetchChangeLog(changes) {

         console.log("####", changes);
        // console.log(product.data.count,product.data.products);

        let changeDetails = changes;
        console.log(changeDetails.changeList);

        const container = document.createElement('div');
        container.classList.add('container');
        container.classList.add('active');
       
        const innerContainer = document.createElement('div');
        innerContainer.className = "innerContainer";

        const index = document.createElement('div');
        index.className = "index";

        const details = document.createElement('div');
        details.className = "details";

        let topBar = document.createElement('div');
        topBar.className = "topBar";
        var heading = document.createElement('h3');
        heading.innerHTML = AB_config.title;
        topBar.appendChild(heading);
        innerContainer.appendChild(topBar);


        let changeLogs = document.createElement('div');
        changeLogs.className="changeLogs";

        let changeLogName = document.createElement('div');
        changeLogName.className="changeLogName";

        let footer = document.createElement('div');
        footer.className = "footer";
        var readMoreLink = document.createElement('a');
        readMoreLink.innerHTML = AB_config.readMore;
        readMoreLink.className = "readMore";
        readMoreLink.href = "http://localhost:5000/changelog";
        footer.appendChild(readMoreLink);

        index.appendChild(topBar);
        index.appendChild(changeLogs);
        index.appendChild(footer);
        innerContainer.appendChild(index);
        innerContainer.appendChild(details);
        container.appendChild(innerContainer);
        document.body.appendChild(container);


        changeDetails.changeList.map((change) => {
            let logList = document.createElement('div');
            logList.className="logList";

            change.category.map((item) => {
                let categories = document.createElement('span');
                categories.classList.add('category');
                if(item == "new") {
                    categories.classList.add('categoryBlue');
                } else if (item == "fix") {
                    categories.classList.add('categoryPurple');
                }
                
                categories.innerHTML = item;
                 logList.appendChild(categories);
            });

            let title = document.createElement('strong');
            title.classList.add('title');
            title.innerHTML = change.title;
            let body = document.createElement('span');
            body.classList.add('body');
            body.innerHTML = change.body;

            logList.appendChild(title);
            logList.appendChild(body);
            changeLogs.appendChild(logList);

            let logDetailsItem = document.createElement('div');
            logDetailsItem.classList.add('logDetailsItem');
            let logDetailsItemTopBar = document.createElement('div');
            logDetailsItemTopBar.classList.add('topBar');
            var logDetailsItemHeading = document.createElement('h3');
            var btnWrap = document.createElement('span');
            btnWrap.className = "btnWrap";
            var btnLink = document.createElement('a');
            btnLink.href = "#";
            btnLink.className = "back";
            btnLink.innerHTML = "back";
            btnWrap.appendChild(btnLink);
            logDetailsItemHeading.innerHTML = change.title;
            logDetailsItemTopBar.appendChild(btnWrap);
            logDetailsItemTopBar.appendChild(logDetailsItemHeading);
            
            logDetailsItem.appendChild(logDetailsItemTopBar);
            var slideBody = document.createElement('div');
            slideBody.classList.add('slidebody');

            change.category.map((item) => {
                let slideCategories = document.createElement('div');
                slideCategories.classList.add('logDetailsItemCategory');
                if(item == "new") {
                    slideCategories.classList.add('categoryBlue');
                } else if (item == "fix") {
                    slideCategories.classList.add('categoryPurple');
                }
                
                slideCategories.innerHTML = item;
                slideBody.appendChild(slideCategories);
            });
            var slideBodyContent = document.createElement('div');
            slideBodyContent.classList.add('content');
            slideBodyContent.innerHTML = change.body;
            slideBody.appendChild(slideBodyContent);
            logDetailsItem.appendChild(slideBody);
            details.appendChild(logDetailsItem);


        });


        (function() {

            const style = document.createElement('style');

            document.head.appendChild(style);

            style.innerHTML = `


            .container {
                width : 400px;
                height : 300px;
                display : none;
            }

            .container.active {
                display : block;
            }
            .innerContainer {
                height : 100%;
                width : 100%;
                position : relative;
                overflow : hidden;
                
            }

            .index {
                display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    height: 98%;
    width:90%;
    position : absolute;
    left : 0px;
    border: 2px solid #f1f1f1;
    transition : all 0.5s ease;
            }

            .topBar {
                border-bottom: 1px solid #f1f1f1;
    padding: 15px 23px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    font-family: sans-serif;
    position : relative;
            }

            .btnWrap {
                height: 30px;
    width: 30px;
    position: absolute;
    left: 10px;
    top: 15px;
            }

            .back {
                color : grey;
            }

            .topBar h3 {
                margin : 0px;
            }

         
            .changeLogs {
                width : 100%;
                height : 100%;
            }

            .changeLogName {
                width : 100%;
                height : 50%;
                position : absolute;
                top : 0px;
                left : 400px;
            }

            .logList {
                height : 25%;
                padding : 10px;
            }

            .category, .logDetailsItemCategory {
                font-size: 15px;
    line-height: 20px;
    display: inline-block;
    padding: 0 15px;
    font-weight: 400;
    border-radius: 30px;
    margin-right: 3px;
    background-color: #b26cee;
    color: #fff;
}

.categoryBlue {
    background-color: #3778ff;
}

.title {
    color: #222c36;
    font-weight: 600;
    margin : 0px 3px;
}

.body {
    color : grey;
    font-size: 15px;
}

            .footer {
                height: 15%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    font-family: sans-serif;
    border-top: 1px solid #f1f1f1;
      }

            .footer a {
                color : grey;
            }

            .details {
                height: 150px;
    width: 100%;
    position: absolute;
    /* background-color: green; */
    left: 400px;
    border: 2px solid #f1f1f1;
    
            }
            .logDetailsItem {
                height: 100%;
                position: absolute;
                top: 0px;
                left: 0px;
                width: 100%;
                border: 2px solid #f1f1f1;
                transition : all 0.5s ease;
            }

            .slidebody {
                padding : 15px;
            }

            .slidebody .content {
                padding-top : 10px;
                font-size : 15px;
                color : grey;
            }
            


            .slidebody:hover,.changeLogs:hover{
                cursor: pointer;
            }
            .index.slide,.logDetailsItem.slide {
                transform: translateX(-400px);
            }
            `;
        })();



        // var openLog = document.getElementsByClassName('changeLogs')[0];
        // openLog.addEventListener('click', openName);
        var loglist = document.getElementsByClassName('logList');
        for(i=0;i<loglist.length;i++) {
            loglist[i].addEventListener('click',openName, false);
        }



        var back = document.getElementsByClassName('back');
        console.log(back);
        for(i=0;i<back.length;i++) {
            back[i].addEventListener('click',closeName,false);
        }

        function openName(e) {
            AB_config.callbacks.onShowDetails();
            let target;
            if(e.target.classList.contains("category") ||
             e.target.classList.contains("title") ||
              e.target.classList.contains("body")) {
                  target = e.target.parentNode;
              } else {
                  target = e.target;
              }
            console.log(e.target.parentNode);

            document.getElementsByClassName('index')[0].classList.add('slide');
            var child = Array.prototype.slice.call(document.getElementsByClassName('changeLogs')[0].children);
            console.log(child);
            var index = child.indexOf(target);
            console.log(index);
            console.log(e.target.parentNode);
            console.log(e.currentTarget.parentNode.parentNode.nextElementSibling);
             e.currentTarget.parentNode.parentNode.nextElementSibling.children[index].classList.add('slide');
        }
    
        function closeName(e) {
            var logDetailsItem = document.getElementsByClassName('logDetailsItem');
            for(i=0;i<logDetailsItem.length;i++) {
                logDetailsItem[i].classList.remove('slide');
            }
            //document.getElementsByClassName('logDetailsItem')[i].classList.remove('slide');
            document.getElementsByClassName('index')[0].classList.remove('slide');
            //e.target.parentNode.classList.remove('slide');
              
        }
    }

   
    

        

    




    // console.log("loaded");
    // var script = document.createElement('script');
    // script.src = "plugin.js";
    // script.type = "text/javascript";
    
    // document.head.appendChild(script);



