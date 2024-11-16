"use strict";

document.addEventListener("DOMContentLoaded", function () {
  // element toggle function
  const elementToggleFunc = function (elem) {
    elem.classList.toggle("active");
  };

  // sidebar variables
  const sidebar = document.querySelector("[data-sidebar]");
  const sidebarBtn = document.querySelector("[data-sidebar-btn]");

  // sidebar toggle functionality for mobile
  if (sidebarBtn) {
    sidebarBtn.addEventListener("click", function () {
      elementToggleFunc(sidebar);
    });
  }

  // testimonials variables
  const testimonialsItem = document.querySelectorAll(
    "[data-testimonials-item]"
  );
  const modalContainer = document.querySelector("[data-modal-container]");
  const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
  const overlay = document.querySelector("[data-overlay]");

  // modal variable
  const modalImg = document.querySelector("[data-modal-img]");
  const modalTitle = document.querySelector("[data-modal-title]");
  const modalText = document.querySelector("[data-modal-text]");

  // modal toggle function
  const testimonialsModalFunc = function () {
    modalContainer.classList.toggle("active");
    overlay.classList.toggle("active");
  };

  // add click event to all modal items
  testimonialsItem.forEach((item) => {
    item.addEventListener("click", function () {
      modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
      modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
      modalTitle.innerHTML = this.querySelector(
        "[data-testimonials-title]"
      ).innerHTML;
      modalText.innerHTML = this.querySelector(
        "[data-testimonials-text]"
      ).innerHTML;
      testimonialsModalFunc();
    });
  });

  // add click event to modal close button
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", testimonialsModalFunc);
  }
  if (overlay) {
    overlay.addEventListener("click", testimonialsModalFunc);
  }

  // custom select variables
  const select = document.querySelector("[data-select]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const selectValue = document.querySelector("[data-selecct-value]");
  const filterBtn = document.querySelectorAll("[data-filter-btn]");

  if (select) {
    select.addEventListener("click", function () {
      elementToggleFunc(this);
    });
  }

  // add event in all select items
  selectItems.forEach((item) => {
    item.addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      selectValue.innerText = this.innerText;
      elementToggleFunc(select);
      filterFunc(selectedValue);
    });
  });

  // filter variables
  const filterItems = document.querySelectorAll("[data-filter-item]");

  const filterFunc = function (selectedValue) {
    filterItems.forEach((item) => {
      if (selectedValue === "all" || selectedValue === item.dataset.category) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  };

  // add event in all filter button items for large screen
  let lastClickedBtn = filterBtn[0];

  filterBtn.forEach((btn) => {
    btn.addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      selectValue.innerText = this.innerText;
      filterFunc(selectedValue);

      lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;
    });
  });

  // contact form variables
  const form = document.querySelector("[data-form]");
  const formInputs = document.querySelectorAll("[data-form-input]");
  const formBtn = document.querySelector("[data-form-btn]");

  // add event to all form input field
  formInputs.forEach((input) => {
    input.addEventListener("input", function () {
      // check form validation
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    });
  });

  // page navigation variables
  const navigationLinks = document.querySelectorAll("[data-nav-link]");
  const pages = document.querySelectorAll("[data-page]");

  // add event to all nav link
  navigationLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault(); // Prevent default link behavior
      pages.forEach((page, i) => {
        if (this.innerHTML.toLowerCase() === page.dataset.page) {
          page.classList.add("active");
          navigationLinks[i].classList.add("active");
          window.scrollTo(0, 0);
        } else {
          page.classList.remove("active");
          navigationLinks[i].classList.remove("active");
        }
      });
    });
  });

  // 3D Model Viewer
  let scene, camera, renderer, model;
  const modal = document.getElementById("model-viewer-modal");
  const modelViewerContainer = document.getElementById(
    "model-viewer-container"
  );
  const openButtons = document.querySelectorAll(".open-3d-viewer");
  const closeButton = document.querySelector(".close");
  const infoElement = document.getElementById("info");
  const errorElement = document.getElementById("error");

  function initModelViewer(modelPath) {
    if (!modelViewerContainer) {
      console.error("Model viewer container not found");
      return;
    }

    // Clear previous content
    modelViewerContainer.innerHTML = "";
    if (errorElement) errorElement.textContent = "";
    if (infoElement) infoElement.textContent = "Loading 3D Model...";

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      modelViewerContainer.clientWidth / modelViewerContainer.clientHeight,
      0.1,
      1000
    );

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      modelViewerContainer.clientWidth,
      modelViewerContainer.clientHeight
    );
    renderer.setClearColor(0xffffff, 1);
    modelViewerContainer.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-1, 1, -1);
    scene.add(directionalLight2);

    const loader = new THREE.GLTFLoader();
    loader.load(
      modelPath,
      function (gltf) {
        model = gltf.scene;
        scene.add(model);

        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        // Adjust camera position based on model size
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        camera.position.z = cameraZ * 1.5; // Adjust multiplier as needed

        camera.updateProjectionMatrix();

        if (infoElement) {
          infoElement.textContent =
            "3D Model Loaded - Click and drag to rotate";
        }
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (error) {
        console.error("An error happened", error);
        if (infoElement) {
          infoElement.textContent = "Error loading 3D model";
        }
        if (errorElement) {
          errorElement.textContent = "Error details: " + error.message;
        }
      }
    );

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;

    animate();
  }

  function animate() {
    requestAnimationFrame(animate);
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  function onWindowResize() {
    if (camera && renderer && modelViewerContainer) {
      camera.aspect =
        modelViewerContainer.clientWidth / modelViewerContainer.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        modelViewerContainer.clientWidth,
        modelViewerContainer.clientHeight
      );
    }
  }

  openButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation(); // Stop the event from bubbling up
      if (modal) {
        modal.style.display = "block";
        const modelPath = this.getAttribute("data-model");
        initModelViewer(modelPath);
      }
    });
  });

  if (closeButton) {
    closeButton.addEventListener("click", function (e) {
      e.stopPropagation(); // Stop the event from bubbling up
      if (modal) {
        modal.style.display = "none";
      }
      if (modelViewerContainer) {
        modelViewerContainer.innerHTML = "";
      }
      if (errorElement) {
        errorElement.textContent = "";
      }
    });
  }

  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      if (modal) {
        modal.style.display = "none";
      }
      if (modelViewerContainer) {
        modelViewerContainer.innerHTML = "";
      }
      if (errorElement) {
        errorElement.textContent = "";
      }
    }
  });

  window.addEventListener("resize", onWindowResize, false);
  /* 
  //Remove the global error listener as it's causing confusion
  window.addEventListener("error", function (e) {
    const errorElem = document.getElementById("error");
    if (errorElem) {
      errorElem.textContent += "\nGlobal error: " + e.message;
    }
  }); */

  window.addEventListener("error", function (e) {
    const errorElem = document.getElementById("error");
    if (errorElem) {
      errorElem.textContent += "\nGlobal error: " + e.message;
    }
  });
});

var myIndex = 0;
carousel();

function carousel() {
  var i;
  var x = document.getElementsByClassName("mySlides");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  myIndex++;
  if (myIndex > x.length) {
    myIndex = 1;
  }
  x[myIndex - 1].style.display = "block";
  setTimeout(carousel, 4500);
}
