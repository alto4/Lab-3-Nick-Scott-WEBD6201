namespace core
{
  /**
   * This function allows the buttons to change the mouse icon on hover
   * 
   * @returns {void}
   */
  function addLinkEvents(): void {
    //remove all events first
    $("ul>li>a").off("click");
    $("ul>li>a").off("mouseover");
    // loop through each anchor tag in the unordered list and
    // add an event listener / handler to allow for
    // content injection
    $("ul>li>a").on("click", function () {
      loadLink($(this).attr("id"));
    });
    // make it look like each nav item is an active link
    $("ul>li>a").on("mouseover", function () {
      $(this).css("cursor", "pointer");
    });
  }

  /**
     * This function highlights the active link in the nav bar
     *
     * @param {string} link
     * @param {string} [data=""]
     */
   function highlightActiveLink(link: string, data: string = ""):void
   {
     // swap active link
     $(`#${router.ActiveLink}`).removeClass("active"); // removes highlighted link
           
     if(link == "logout")
     {
       sessionStorage.clear();
       router.ActiveLink = "login";
     }
     else
     {
       router.ActiveLink = link;
       router.LinkData = data;
     }
     $(`#${router.ActiveLink}`).addClass("active"); // applies highlighted link to new page
   }

  /**
   * Inject the Navigation bar into the Header element and highlight the active link based on the pageName parameter
   *
   * @param {string} pageName
   * @returns {void}
   */
  function loadHeader(pageName: string): void {
    // inject the Header
    $.get("./Views/components/header.html", function (data) {
      $("header").html(data); // load the navigation bar

      
      $(`#${pageName}`).addClass("active"); // highlight active link

      addLinkEvents();
      // loop through each anchor tag in the unordered list and
      // add an event listener / handler to allow for
      // content injection
      $("a").on("click", function () {
        $(`#${router.ActiveLink}`).removeClass("active"); // removes highlighted link
        router.ActiveLink = $(this).attr("id");
        loadContent(router.ActiveLink, ActiveLinkCallBack(router.ActiveLink));
        $(`#${router.ActiveLink}`).addClass("active"); // applies highlighted link to new page
        history.pushState({}, "", router.ActiveLink); // this replaces the url displayed in the browser

         addLinkEvents();
      });

      // make it look like each nav item is an active link
      $("a").on("mouseover", function () {
        $(this).css("cursor", "pointer");
      });
    });
  }

  /**
   * This function switches page content to the relative link passed into the function
   * optionally, LinkData can also be passed
   * @param {string} link
   * @param {string} [data=""]
   * @returns {void}
   */
  function loadLink(link: string, data: string = ""): void {
    
    
    highlightActiveLink(link);
    
    if(link == "logout")
    {
      sessionStorage.clear();
      router.ActiveLink = "login";
    } 
    else 
    {
      router.ActiveLink = link;
      router.LinkData = data;
    }
    
    highlightActiveLink(link, data);
    loadContent(router.ActiveLink, ActiveLinkCallBack(router.ActiveLink));
    history.pushState({}, "", router.ActiveLink); // this replaces the url displayed in the browser
  }

  /**
   * Inject page content in the main element
   *
   * @param {string} pageName
   * @param {function} callback
   * @returns {void}
   */
  function loadContent(pageName: string, callback: Function): void {
    // inject content
    $.get(`./Views/content/${pageName}.html`, function (data) {
      $("main").html(data);
      toggleLogin(); // add login / logout and secure links

      callback();
    });
  }

  /**
   * This function loads the footer
   * 
   * @returns {void}
   */
  function loadFooter(): void {
    // inject the Footer
    $.get("./Views/components/footer.html", function (data) {
      $("footer").html(data);
    });
  }

  function displayHome(): void {}

  function displayAbout(): void {}

  function displayProjects(): void {}

  function displayServices(): void {}

  /**
   * This function uses regex to test a user input name 
   * 
   * @returns {void}
   */
  function testFullName(): void {
    let messageArea = $("#messageArea").hide();
    let fullNamePattern = /([A-Z][a-z]{1,25})+(\s|,|-)([A-Z][a-z]{1,25})+(\s|,|-)*/;

    $("#fullName").on("blur", function () {
      if (!fullNamePattern.test($(this).val().toString())) {
        $(this).trigger("focus").trigger("select");
        messageArea
          .show()
          .addClass("alert alert-danger")
          .text(
            "Please enter a valid Full Name. This must include at least a Capitalized first name followed by a Capitlalized last name."
          );
      } else {
        messageArea.removeAttr("class").hide();
      }
    });
  }

  /**
   * This function uses regex to test a user input contact number 
   * 
   * @returns {void}
   */
  function testContactNumber(): void {
    let messageArea = $("#messageArea");
    let contactNumberPattern = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

    $("#contactNumber").on("blur", function () {
      if (!contactNumberPattern.test($(this).val().toString())) {
        $(this).trigger("focus").trigger("select");
        messageArea
          .show()
          .addClass("alert alert-danger")
          .text(
            "Please enter a valid Contact Number. Country code and area code are both optional"
          );
      } else {
        messageArea.removeAttr("class").hide();
      }
    });
  }

  /**
   * This function uses regex to test a user input email 
   * 
   * @returns {void}
   */
  function testEmailAddress(): void {
    let messageArea = $("#messageArea");
    let emailAddressPattern = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/;

    $("#emailAddress").on("blur", function () {
      if (!emailAddressPattern.test($(this).val().toString())) {
        $(this).trigger("focus").trigger("select");
        messageArea
          .show()
          .addClass("alert alert-danger")
          .text("Please enter a valid Email Address.");
      } else {
        messageArea.removeAttr("class").hide();
      }
    });
  }

  /**
   * Function to call all of the test functions
   * 
   * @returns {void}
   */
  function formValidation(): void {
    testFullName();
    testContactNumber();
    testEmailAddress();
  }

  /**
   * This function is used to display the contact page
   * 
   * @returns {void}
   */
  function displayContact(): void {
    // form validation
    formValidation();

    $("#sendButton").on("click", (event) => {
      let subscribeCheckbox = $("#subscribeCheckbox")[0] as HTMLInputElement;
      let fullName = $("#fullName")[0] as HTMLInputElement;
      let contactNumber = $("#contactNumber")[0] as HTMLInputElement;
      let emailAddress = $("#emailAddress")[0] as HTMLInputElement;

      if (subscribeCheckbox.checked) {
        let contact = new core.Contact(
          fullName.value,
          contactNumber.value,
          emailAddress.value
        );

        if (contact.serialize()) {
          let key = contact.FullName.substring(0, 1) + Date.now();

          localStorage.setItem(key, contact.serialize());
        }
      }
    });
  }
 
  function displayContactList(): void {
    // don't allow visitors to go here
    authGuard();

    if (localStorage.length > 0) {
      let contactList = document.getElementById("contactList");

      let data = "";

      let keys = Object.keys(localStorage);

      let index = 1;

      for (const key of keys) {
        let contactData = localStorage.getItem(key);

        let contact = new core.Contact();
        contact.deserialize(contactData);

        data += `<tr>
          <th scope="row" class="text-center">${index}</th>
          <td>${contact.FullName}</td>
          <td>${contact.ContactNumber}</td>
          <td>${contact.EmailAddress}</td>
          <td class="text-center"><button value="${key}" class="btn btn-primary btn-sm edit"><i class="fas fa-edit fa-sm"></i> Edit</button></td>
          <td class="text-center"><button value="${key}" class="btn btn-danger btn-sm delete"><i class="fas fa-trash-alt fa-sm"></i> Delete</button></td>
          </tr>`;

        index++;
      }

      contactList.innerHTML = data;

      $("button.edit").on("click", function () {
        // location.href = "/edit#" + $(this).val();
        loadLink("edit#" + $(this).val().toString());
      });

      $("button.delete").on("click", function () {
        if (confirm("Are you sure?")) {
          localStorage.removeItem($(this).val().toString());
        }
        //location.href = "/contact-list"; // refresh the page
        loadLink("contact-list");
      });

      $("#addButton").on("click", function () {
        //location.href = "/edit";
        loadLink("edit");
      });
    }
  }

  function displayEdit(): void {
    let key = router.LinkData;

    let contact = new core.Contact();

    // check to ensure that the key is not empty
    if (key != "") {
      // get contact info from localStorage
      contact.deserialize(localStorage.getItem(key));

      // display contact information in the form
      $("#fullName").val(contact.FullName);
      $("#contactNumber").val(contact.ContactNumber);
      $("#emailAddress").val(contact.EmailAddress);
    } else {
      // modify the page so that it shows "Add Contact" in the header
      $("main>h1").text("Add Contact");
      // modify edit button so that it shows "Add" as well as the appropriate icon
      $("#editButton").html(`<i class="fas fa-plus-circle fa-lg"></i> Add`);
    }

    // form validation
    formValidation();

    $("#editButton").on("click", function () {
      // check to see if key is empty
      if (key == "") {
        // create a new key
        key = contact.FullName.substring(0, 1) + Date.now();
      }
      
      // copy contact info from form to contact object
      contact.FullName = $("#fullName").val().toString();
      contact.ContactNumber = $("#contactNumber").val().toString();
      contact.EmailAddress = $("#emailAddress").val().toString();

      // add the contact info to localStorage
      localStorage.setItem(key, contact.serialize());

      // return to the contact list
      //location.href = "/contact-list";
      loadLink("contact-list");
    });

    $("#cancelButton").on("click", function () {
      // return to the contact list
      //location.href = "/contact-list";
      loadLink("contact-list");
    });
  }

  /**
   * Processes the Login and performs validation
   */
  function performLogin(): void {
    let messageArea = $("#messageArea");
    messageArea.hide();

    let username = $("#username");
    let password = $("#password");
    let success = false;
    let newUser = new core.User();

    // use ajax to access the json file
    $.get("./Data/users.json", function (data) {
      // check each user in the users.json file  (linear search)
      for (const user of data.users) {
        if (
          username.val() == user.Username &&
          password.val() == user.Password
        ) {
          newUser.fromJSON(user);
          success = true;
          break;
        }
      }

      // if username and password matches - success... then perform login
      if (success) {
        // add user to session storage
        sessionStorage.setItem("user", newUser.serialize());

        // hide any error message
        messageArea.removeAttr("class").hide();

        // redirect user to secure area - task-list.html
        loadLink("task-list");
        // location.href = "/task-list";
      } else {
        // display an error message
        username.trigger("focus").trigger("select");
        messageArea
          .show()
          .addClass("alert alert-danger")
          .text("Error: Invalid login information");
      }
    });
  }

  /**
   * Displays and Processes the Login page
   */
  function displayLogin(): void {
    $("#loginButton").on("click", function () {
      performLogin();
    });

    $("#password").on("keypress", function (event) {
      if (event.key == "Enter") {
        performLogin();
      }
    });

    $("#cancelButton").on("click", function () {
      // clear the login form
      document.forms[0].reset();
      // return to the home page
      //location.href = "/home";
      loadLink("home");
    });
  }

  function displayRegister():void {}

  function toggleLogin():void {
    // Make a reference to track presence of protected pages in navbar
    let contactListLink = $("#contactListLink")[0];
    let taskListLink = $("#taskListLink")[0];

    // if user is logged in
    if (sessionStorage.getItem("user")) {
      // swap out the login link for logout
      $("#loginListItem").html(
        `<a id="logout" class="nav-link" aria-current="page"><i class="fas fa-sign-out-alt"></i> Logout</a>`
      );

      $("#logout").on("click", function () {
        // perform logout
        sessionStorage.clear();

        // redirect back to login
        //location.href = "/login";
        loadLink("login");
      });

      // make it look like each nav item is an active link
      $("#logout").on("mouseover", function () {
        $(this).css("cursor", "pointer");
      });

      
      if(!contactListLink)
      {
        // Add link to Contact List for logged in user
        $(`<li id="contactListLink" class="nav-item">
            <a id="contact-list" class="nav-link" aria-current="page"><i class="fas fa-users fa-lg"></i> Contact List</a>
          </li>`).insertBefore("#loginListItem");
      }
      
      if(!taskListLink) {
        // Add link to Task List for logged in user
        $(`<li id="taskListLink"  class="nav-item">
          <a id="task-list" class="nav-link" aria-current="page"><i class="fas fa-users fa-lg"></i> Task List</a>
        </li>`).insertBefore("#loginListItem");
      }
    } else {
      //logged out
      // swap out the login link for logout
      $("#loginListItem").html(
        `<a id="login" class="nav-link" aria-current="page"><i class="fas fa-sign-in-alt"></i> Login</a>`
      );

      // Remove contact list link if user is logged out
      if(contactListLink)
      {
        $("#contactListLink").remove();
      }
      
      // Remove task list link if user if logged out
      if(taskListLink) {
        $("#taskListLink").remove();  
      }
    }

     addLinkEvents();
    // highlightActiveLink(router.ActiveLink);
  }

  function authGuard(): void {
    if (!sessionStorage.getItem("user")) {
      // redirect back to login page
      //location.href = "/login";
      loadLink("login");
    }
  }

  function displayTaskList(): void {
    // don't allow visitors to go here
    authGuard();

    addTaskEventListeners();
    // add a new Task to the Task List
    $("#newTaskButton").on("click", function () {
      alert("Clicked!");
      AddNewTask();
    });
  }

  function display404(): void {}

  function ActiveLinkCallBack(activeLink: string): Function {
    switch (activeLink) {
      case "home":
        return displayHome;
      case "about":
        return displayAbout;
      case "projects":
        return displayProjects;
      case "services":
        return displayServices;
      case "contact":
        return displayContact;
      case "contact-list":
        return displayContactList;
      case "edit":
        return displayEdit;
      case "task-list":
        return displayTaskList;
      case "login":
        return displayLogin;
      case "register":
        return displayRegister;
      case "404":
        return display404;
      default:
        console.error("ERROR: callback does not exist: " + activeLink);
        break;
    }
  }

  function addTaskEventListeners(): void {
    // Edit an Item in the Task List
    $("ul").on("click", ".editButton", function () {
      let editText = $(this).parent().parent().children(".editTextInput");
      let text = $(this).parent().parent().text();
      let messageArea = $("#messageArea");

      editText.val(text).show().trigger("select");
      editText.on("keypress", function (event) {
        if (event.key == "Enter") {
          if (editText.val() != "" && editText.val().toString().charAt(0) != " ") {
            editText.hide();
            $(this).parent().children("#taskText").text(editText.val().toString());
            
            messageArea.removeAttr("class").hide();
          } else {
            editText.trigger("focus").trigger("select");
            messageArea
              .show()
              .addClass("alert alert-danger")
              .text("Please enter a valid Task.");
          }
        }
      });
    });

    // Delete a Task from the Task List
    $("ul").on("click", ".deleteButton", function () {
      if (confirm("Are you sure?")) {
        $(this).closest("li").remove();
      }
    });
  }

  /**
   * This function adds a new Task to the TaskList
   */
  function AddNewTask(): void {
    let messageArea = $("#messageArea");
    messageArea.hide();
    let taskInput = $("#taskTextInput");

    // DEBUG CODE - TO BE REMOVED
    //console.log(taskInput.val());
    //$("#taskList").append("<h1>Hey. I'm new!</h1>");

    if (taskInput.val() != "" && taskInput.val().toString().charAt(0) != " ") {
      let newElement = `
              <li class="list-group-item" id="task">
              <span id="taskText">${taskInput.val()}</span>
              <span class="float-end">
                  <button class="btn btn-outline-primary btn-sm editButton"><i class="fas fa-edit"></i>
                  <button class="btn btn-outline-danger btn-sm deleteButton"><i class="fas fa-trash-alt"></i></button>
              </span>
              <input type="text" class="form-control edit-task editTextInput">
              </li>
              `;
      $("#taskList").append(newElement);
      messageArea.removeAttr("class").hide();
      taskInput.val("");
    } else {
      taskInput.trigger("focus").trigger("select");
      messageArea
        .show()
        .addClass("alert alert-danger")
        .text("Please enter a valid Task.");
    }

    addTaskEventListeners();
  }

  /**
   * This function is the Callback function for the TaskList
   *
   */
  function DisplayTaskList(): void {
    let messageArea = $("#messageArea");
    messageArea.hide();
    let taskInput = $("#taskTextInput");

    // add a new Task to the Task List
    $("#newTaskButton").on("click", function () {
      AddNewTask();
    });

    taskInput.on("keypress", function (event) {
      if (event.key == "Enter") {
        AddNewTask();
      }
    });

    /*   // Edit an Item in the Task List
    $("ul").on("click", ".editButton", function () {
      let editText = $(this).parent().parent().children(".editTextInput");
      let text = $(this).parent().parent().text();
      editText.val(text).show().trigger("select");
      editText.on("keypress", function (event) {
        if (event.key == "Enter") {
          if (editText.val() != "" && editText.val().charAt(0) != " ") {
            editText.hide();
            $(this).parent().children("#taskText").text(editText.val());
            messageArea.removeAttr("class").hide();
          } else {
            editText.trigger("focus").trigger("select");
            messageArea
              .show()
              .addClass("alert alert-danger")
              .text("Please enter a valid Task.");
          }
        }
      });
    });

    // Delete a Task from the Task List
    $("ul").on("click", ".deleteButton", function () {
      if (confirm("Are you sure?")) {
        $(this).closest("li").remove();
      }
    });
 */
  }

  function Start(): void {
    console.log("App Started...");

    loadHeader(router.ActiveLink);

    loadContent(router.ActiveLink, ActiveLinkCallBack(router.ActiveLink));

    loadFooter();
  }

  window.addEventListener("load", Start);

};
