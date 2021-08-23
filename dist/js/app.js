function moveArrow(e, dist) {
  $("#" + e).css("transform", "translateX(" + dist + "px)");
}

$("#open-btn").on("mouseover", () => {
  moveArrow("right-arrow", 10);
});
$("#open-btn").on("mouseleave", () => {
  moveArrow("right-arrow", 0);
});

$("#open-open-btn").on("mouseover", () => {
  moveArrow("left-arrow", -10);
});
$("#open-open-btn").on("mouseleave", () => {
  moveArrow("left-arrow", 0);
});

$("#add-main").on("click", checkEverything);
$("#items-container").on("click", makeChanges);
$(".open-area").on("click", makeOpenChange);
$("#search").on("keyup", searchElement);
$("#search").on("blur", resetContainer);
$(".text-name").on("keyup", e => {
  keyCheck(e, ".text-des");
});
$(".text-des").on("keyup", e => {
  keyCheck(e, ".text-data");
});
var container_elements_objs = null;
var spec_element;
var remove_element;
$("#del-btn").on("click", () => {
  if (remove_element == null) {
    makeOpenRemove();
  } else {
    makeRemove(remove_element);
  }
  endConfimPop();
});

$("#cancel-btn").on("click", () => {
  remove_element = null;
  endConfimPop();
});

function keyCheck(e, field_name) {
  if (e.which == 13 || e.keycode == 13) {
    if (e.target.value.trim()) $(field_name).focus();
  }
}

function searchElement(e) {
  if (container_elements_objs == null) {
    container_elements_objs = {};
    let element_class_id;
    let container_elements = $("#items-container").children();
    Array.from(container_elements).forEach(element => {
      element_class_id = $(element)
        .attr("class")
        .split("-")[1];
      container_elements_objs[element_class_id] = element;
    });
  }
  let text = e.target.value.trim();
  const local_data = loadLocal("KeepIt_V2_u_data", "[]");
  local_data.forEach(obj => {
    if (obj.title.toLowerCase().indexOf(text.toLowerCase()) != -1) {
      $(container_elements_objs[obj.id]).css("display", "flex");
    } else {
      $(container_elements_objs[obj.id]).css("display", "none");
    }
  });
}

function resetContainer(e) {
  let container_elements = $("#items-container").children();
  Array.from(container_elements).forEach(element => {
    $(element).css("display", "flex");
  });
  e.target.value = "";
  container_elements_objs = null;
}

function makeChanges(e) {
  if ($(e.target).attr("id") === "remove") {
    remove_element = e;
    confirmPop();
  } else if ($(e.target).attr("id") === "edit") {
    getData(e, true);
    makeRemove(e);
  } else if ($(e.target).attr("id") === "open-btn") {
    spec_element = $(e.target)
      .parent()
      .parent();
    swapBetween();
  } else if ($(e.target).attr("id") == "more-plus") {
    plusMore(e.target, true);
  } else if ($(e.target).attr("id") == "more-minus") {
    plusMore(e.target, false);
  }
}

function checkEverything() {
  let title_val = $(".text-name")
    .val()
    .trim();
  let des_val = $(".text-des")
    .val()
    .trim();
  let data_val = $(".text-data")
    .val()
    .trim();
  console.log(data_val.split("\n"));
  if (!checkExistence(title_val)) {
    if (title_val && des_val && data_val) {
      const id = getLargeLocal() + 1;
      setItem(id, title_val, des_val, data_val);
      makeLocal(id, title_val, des_val, data_val);
      Array.from([".text-name", ".text-des", ".text-data"]).forEach(e => {
        $(e).val("");
      });
    } else {
      ErrPop(0);
    }
  } else {
    ErrPop(1);
  }
}

async function setItem(id, title_val, des_val, data_val) {
  let set_item_pro = new Promise(res => {
    res();
  });

  await set_item_pro.then(() => {
    $("#items-container").append(`
        <div class="item item-${id}">
        <h2 class="item-title">
        ${
          title_val.length > 30 ? title_val.slice(0, 28) + "..." : title_val
        }<button id="open-btn" class="btn-open btn">OPEN<i id = "right-arrow" class="fa fa-long-arrow-alt-right bm-right"></i></button>
        </h2>
        <h4 class="item-description">
          ${des_val.length > 70 ? des_val.slice(0, 68) + "..." : des_val}
        </h4>
        <p class="item-main-text">
          ${
            data_val.length > 135
              ? data_val.slice(0, 133).replace("\n", "<br>") + "..."
              : data_val.replace("\n", "<br>")
          }
        </p>
        <div class="btns">
          <button id = "edit" class="item-edit-btn btn">Edit</button>
          <button id = "remove" class="item-remove-btn btn">Remove</button>
          ${
            data_val.length > 135
              ? `<button class="more-text" id="more-plus">+ More</button>`
              : ""
          }
        </div>
      </div>
        `);
  });

  setLocalNumber();
  if ($(window).innerWidth() > 500) $(".text-name").focus();
}

function swapBetween() {
  data = getLocalData(
    $(spec_element)
      .attr("class")
      .split("-")[1]
  );

  $(".open-area")
    .html(
      `<h1 class="open-head">${
        data[0]
      }<button id = "open-open-btn" class="open-btn-open btn"><i id = "left-arrow" class="fa fa-long-arrow-alt-left bm-left"></i>Back</button></h1>
        <h4 class="open-description">${data[1]}</h4>
        <p class="open-text-data">${data[2]}</p>
        <p class="open-btns">
            <button id = "open-edit" class="open-item-edit-btn btn">Edit</button>
            <button id = "open-remove"" class="open-item-remove-btn btn">Remove</button>
        </p>`
    )
    .css("display", "block");
  $("#showcase-area").css("display", "none");
}

function makeOpenChange(e) {
  if ($(e.target).attr("id") === "open-open-btn") {
    goBack();
  }

  if ($(e.target).attr("id") === "open-edit") {
    getData(spec_element, false);
    $(spec_element).remove();
    goBack();
    delLocal(
      $(spec_element)
        .attr("class")
        .split("-")[1]
    );
    spec_element = null;
    setLocalNumber();
  }

  if ($(e.target).attr("id") === "open-remove") {
    confirmPop();
  }
}

function makeOpenRemove() {
  goBack();
  $(spec_element).remove();
  delLocal(
    $(spec_element)
      .attr("class")
      .split("-")[1]
  );
  spec_element = null;
  setLocalNumber();
}

function goBack() {
  $("#showcase-area").css("display", "block");
  $(".open-area")
    .css("display", "none")
    .html("");
}

function confirmPop() {
  $(".sure").css("visibility", "visible");
  const pop_up = $(".sure-inner");
  pop_up.css("opacity", "1");
  setTimeout(() => {
    pop_up.css("transform", "scale(1)");
  }, 10);
}

function endConfimPop() {
  $(".sure-inner")
    .css("opacity", "0")
    .css("transform", "scale(0)");

  setTimeout(() => {
    $(".sure")
      .css("transition", "all 0.2s linear")
      .css("visibility", "hidden");
  }, 10);
}

function ErrPop(index) {
  const vals = ["All Fields Required!", "Already Exists!"];
  $("#card-text").text(vals[index]);
  $("#main-card")
    .css("opacity", "1")
    .css("transform", "translateY(0px)");
  setTimeout(() => {
    $("#main-card")
      .css("opacity", "0")
      .css(
        "transform",
        `translateY(${$(window).innerWidth() < 501 ? "-110px" : "110px"})`
      );
  }, 2000);
}

function plusMore(e, val) {
  let data = loadLocal("KeepIt_V2_u_data", "[]");
  const item_id = $(e)
    .parent()
    .parent()
    .attr("class")
    .split("-")[1];
  data.forEach(element => {
    if (element.id == item_id) {
      const prev_element = $(e)
        .parent()
        .prev();
      let text_data = element.data.trim();

      if (val) {
        $(prev_element).slideUp(180);
        console.log(prev_element);
        $(prev_element).html(
          text_data.length < 300 ? text_data : text_data.slice(0, 298) + "..."
        );
        $(prev_element).slideDown(360);
        $(e).attr("id", "more-minus");
        $(e).fadeOut(410);
        setTimeout(() => {
          $(e).text("- Less");
        }, 210);
        $(e).fadeIn(410);
      } else {
        $(prev_element).slideUp(360);
        setTimeout(() => {
          $(prev_element).html(text_data.slice(0, 133) + "...");
        }, 340);
        $(prev_element).slideDown(180);
        $(e).attr("id", "more-plus");
        $(e).fadeOut(410);
        setTimeout(() => {
          $(e).text("+ More");
        }, 210);
        $(e).fadeIn(410);
      }
    }
  });
}

function makeRemove(e) {
  const parent = $(e.target)
    .parent()
    .parent();
  delLocal(
    $(parent)
      .attr("class")
      .split("-")[1]
  );
  parent.remove();
  setLocalNumber();
  remove_element = null;
}

function getData(parent_id, about_window) {
  const inputs = [".text-name", ".text-des", ".text-data"];
  let parent_data = loadLocal("KeepIt_V2_u_data", "[]");
  if (about_window) {
    parent_id = $(parent_id.target)
      .parent()
      .parent();
  }
  parent_id = $(parent_id)
    .attr("class")
    .split("-")[1];

  parent_data.forEach(obj => {
    if (obj.id == parent_id) {
      parent_data = [obj.title, obj.des, obj.data];
    }
  });
  inputs.forEach((field, i) => {
    $(field).val(parent_data[i]);
  });
}

function checkExistence(title) {
  const data = loadLocal("KeepIt_V2_u_data", "[]");
  for (let i = 0; i < data.length; i++) {
    if (data[i].title == title) {
      return true;
    }
  }
  return false;
}

function getLocalData(id) {
  data = loadLocal("KeepIt_V2_u_data", "[]");
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == id) {
      const element = data[i];
      return [element.title, element.des, element.data];
    }
  }
}

function delLocal(id) {
  let data = loadLocal("KeepIt_V2_u_data", "[]");
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === Number(id)) {
      data.splice(i, 1);
      break;
    }
  }
  localStorage.setItem("KeepIt_V2_u_data", JSON.stringify(data));
}

function makeLocal(id, title, des, data) {
  let user_data = loadLocal("KeepIt_V2_u_data", "[]");
  user_data.push({ id: id, title: title, des: des, data: data });
  localStorage.setItem("KeepIt_V2_u_data", JSON.stringify(user_data));
}

function getLargeLocal() {
  let data = loadLocal("KeepIt_V2_u_data", "[]");
  let id_array = [];
  for (let i = 0; i < data.length; i++) {
    id_array.push(data[i].id);
  }
  if (id_array.length == 0) {
    return 0;
  } else {
    return Math.max(...id_array);
  }
}

function setLocalNumber() {
  localStorage.setItem("KeepIt_V2_u_local_num", getLargeLocal());
}

function displayLocalData() {
  let data = loadLocal("KeepIt_V2_u_data", "[]");
  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      element = data[i];
      setItem(element.id, element.title, element.des, element.data);
    }
  }
}

function loadLocal(name, type) {
  data = localStorage.getItem(name);
  if (data != null) {
    return JSON.parse(data);
  } else {
    localStorage.setItem(name, type);
    data = localStorage.getItem(name);
    return JSON.parse(data);
  }
}

displayLocalData();
