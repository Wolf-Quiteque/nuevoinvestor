(function ($) {
  'use strict';

  /* ===================================
     TABLE OF CONTENTS
  ======================================
  01. Preloader
  02. Scroll State
  03. Smooth Scroll With Lenis
  04. Scroll To Top
  05. Split Text Animation
  06. Section Reveal Animation
  07. Banner Ambulance Scroll Motion
  08. Mobile Submenu Toggle
  09. Facilities Item Accordion
  10. FAQ Toggle
  11. Circular Button Text
  12. Plan Price Toggle
  13. Quantity Control
  14. Cart Totals Sync
  15. Checkout Form Toggles
  16. Header Search Toggle
  17. Magnific Popup Init
  18. Counter Up
  19. Video Title Word Wrap
  20. Banner Slider Text Animation
  21. ROI Progress Bar
  22. Banner One Slider
  23. Cottage Thumb Slider
  24. Reusable Slick Slider Helper
  25. Facilities Slider
  26. Rooms Slider
  27. Team Slider
  28. Testimonial Slider
  29. Vertical Testimonial Nav Slider
  30. Ticker Slider
  31. Testimonial Slider Three
  32. Testimonial Slider One With Thumbs
  33. Service Details Thumb Slider
  34. Blog Thumb Slider
  35. Department Slider
  36. Testimonial Slider Four
  37. Banner Four Thumb Slider
  38. Swiper Facilities Slider
  39. Swiper Product Slider
  40. Shop Price Range Slider
  41. Nice Select Init
  ====================================== */

  /* 01. Preloader */
  $(".ot-preloader").delay(300).animate({
    "opacity": "0"
  }, 300, function () {
    $(".ot-preloader").css("display", "none");
  });

  /* 02. Scroll State */
  let lastScrollTop = 0;
  const headerScrollOffset = 80;
  const headerDirectionThreshold = 6;

  function updateScrollState(currentScrollTop) {
    const $header = $(".ot-header");
    const scrollDelta = currentScrollTop - lastScrollTop;
    const isScrollingDown = scrollDelta > headerDirectionThreshold;
    const isScrollingUp = scrollDelta < -headerDirectionThreshold;

    if (currentScrollTop > 200) {
      $(".top-action-btn").fadeIn(200);
    } else {
      $(".top-action-btn").fadeOut(200);
    }

    if (currentScrollTop > headerScrollOffset) {
      $header.addClass("header-sticky");

      if (isScrollingDown && currentScrollTop > 140) {
        $header.addClass("header-scroll-hide").removeClass("header-scroll-show");
      } else if (isScrollingUp || currentScrollTop <= 140) {
        $header.addClass("header-scroll-show").removeClass("header-scroll-hide");
      }
    } else {
      $header.removeClass("header-sticky header-scroll-hide header-scroll-show");
    }

    lastScrollTop = Math.max(currentScrollTop, 0);
  }

  gsap.registerPlugin(ScrollTrigger);

  /* 03. Smooth Scroll With Lenis */
  const scrollLenis = typeof Lenis === "function"
    ? new Lenis({
      duration: 1.35,
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
      lerp: 0.08,
      easing: (t) => 1 - Math.pow(1 - t, 4)
    })
    : null;

  if (scrollLenis) {
    scrollLenis.on("scroll", ScrollTrigger.update);
    scrollLenis.on("scroll", ({ scroll }) => updateScrollState(scroll));

    function raf(time) {
      scrollLenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) {
          scrollLenis.scrollTo(value, { immediate: true });
        }

        return window.scrollY || window.pageYOffset;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
      }
    });

    ScrollTrigger.addEventListener("refresh", () => scrollLenis.resize());
    ScrollTrigger.refresh();
  } else {
    $(window).on("scroll", function () {
      updateScrollState($(this).scrollTop());
    });
  }

  const offcanvasElement = document.getElementById("staticBackdrop");

  if (offcanvasElement) {
    offcanvasElement.addEventListener("shown.bs.offcanvas", function () {
      if (scrollLenis) {
        scrollLenis.stop();
      }

      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    });

    offcanvasElement.addEventListener("hidden.bs.offcanvas", function () {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";

      if (scrollLenis) {
        scrollLenis.start();
      }
    });
  }

  /* 04. Scroll To Top */
  $(".top-action-btn").on("click", function (event) {
    event.preventDefault();

    if (scrollLenis) {
      scrollLenis.scrollTo(0, { duration: 1.2 });
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* 05. Split Text Animation */
  function splitText(element) {
    const text = element.innerText;
    element.innerHTML = "";

    text.split(" ").forEach(word => {
      const wordSpan = document.createElement("span");
      wordSpan.className = "split-word";

      word.split("").forEach(char => {
        const charSpan = document.createElement("span");
        charSpan.className = "split-char";
        charSpan.innerText = char;
        wordSpan.appendChild(charSpan);
      });

      element.appendChild(wordSpan);
      element.append(" ");
    });
  }

  function animateSplitText(selector) {
    document.querySelectorAll(selector).forEach(el => {
      splitText(el);

      const chars = el.querySelectorAll(".split-char");
      const charCount = chars.length;

      const stagger = charCount > 50 ? 0.01 : charCount > 20 ? 0.02 : 0.03;

      gsap.fromTo(
        chars,
        {
          y: "100%",
          opacity: 0,
          filter: "blur(10px)"
        },
        {
          y: "0%",
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.6,
          ease: "power4.out",
          stagger: stagger,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reset",
          }
        }
      );
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    animateSplitText(".split-text");
  });


  /* 06. Section Reveal Animation */
  document.querySelectorAll(".animation-section").forEach(section => {
    const items = section.querySelectorAll(".reveal-item");

    if (items.length > 0) {
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none",
          once: true
        }
      });

      items.forEach((item, i) => {
        tl.from(item, {
          duration: 0.5,
          autoAlpha: 0,
          y: 50
        }, i * 0.3);
      });
    }
  });

  /* 07. Banner Ambulance Scroll Motion */
  if ($(".banner-ambulance img").length) {
    gsap.to(".banner-ambulance img", {
      x: () => window.innerWidth + 900,
      ease: "none",
      scrollTrigger: {
        trigger: ".banner-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  }


  /* 08. Mobile Submenu Toggle */
  $(".ot-mobile-menu .has-submenu > a").on("click", function () {
    var item = $(this).parent(".has-submenu");
    item.siblings(".has-submenu").children(".submenu").slideUp();

    item.siblings(".has-submenu").removeClass("has-submenu-open");

    item.siblings(".has-submenu").removeClass("open");

    item.children(".submenu").slideToggle();

    item.toggleClass("has-submenu-open");
  });

  /* 09. Facilities Item Accordion */
  $(".all-facilities .single-facility").on("click", function () {
    $(".single-facility").removeClass("active");
    $(this).addClass("active");
  })

  /* 10. FAQ Toggle */
  $(".faq-item .faq-item-icon").on("click", function () {
    $(this).siblings(".faq-item-content").slideToggle();
    $(this).parent().toggleClass("active");
  })

  /* 11. Circular Button Text */
  const $text = $("#circleText");
  $text.html(
    $text.text()
      .split("")
      .map(function (char, i) {
        return '<span style="transform:rotate(' + (i * 9.3) + 'deg)">' + char + "</span>";
      })
      .join("")
  );

  /* 12. Plan Price Toggle */
  $(".monthly-btn").on("click", function () {
    $(".yearly-btn").removeClass("active");
    $(this).addClass("active");
    $(".yearly-price").css("display", "none");
    $(".monthly-price").css("display", "block");
  });
  $(".yearly-btn").on("click", function () {
    $(".monthly-btn").removeClass("active");
    $(this).addClass("active");
    $(".monthly-price").css("display", "none");
    $(".yearly-price").css("display", "block");
  });

  /* 13. Quantity Control */
  $(document).on("click", ".ot-cart-plus, .ot-cart-minus", function () {
    const $control = $(this).closest(".ot-quantity-control, .ot-quantity-control-2");
    const $input = $control.find(".qty-input");

    if (!$input.length) {
      return;
    }

    const min = Number($input.attr("min")) || 1;
    const maxAttr = $input.attr("max");
    const max = maxAttr ? Number(maxAttr) : Infinity;
    const step = Number($input.attr("step")) || 1;
    const currentValue = Number($input.val()) || min;
    const nextValue = $(this).hasClass("ot-cart-plus")
      ? Math.min(currentValue + step, max)
      : Math.max(currentValue - step, min);

    $input.val(nextValue).trigger("change");
  });

  /* 14. Cart Totals Sync */
  function formatMoney(amount) {
    return "$" + amount.toFixed(2);
  }

  function getShippingCost() {
    return Number($('input[name="shipping"]:checked').val()) || 0;
  }

  function updateCartTotals() {
    const $cartBody = $("#cartItems");
    const $subtotal = $("#subtotal");
    const $totalAmount = $("#totalAmount");

    if (!$cartBody.length || !$subtotal.length || !$totalAmount.length) {
      return;
    }

    let subtotal = 0;

    $cartBody.find("tr").each(function () {
      const $row = $(this);
      const $qtyInput = $row.find(".qty-input");
      const minQty = Number($qtyInput.attr("min")) || 1;
      const inputQty = Number($qtyInput.val());
      const quantity = Number.isFinite(inputQty) && inputQty >= minQty ? inputQty : minQty;
      const price = Number($row.data("price")) || 0;
      const rowTotal = price * quantity;

      $qtyInput.val(quantity);
      $row.attr("data-quantity", quantity);
      $row.find(".product-total").text(formatMoney(rowTotal));

      subtotal += rowTotal;
    });

    const total = subtotal + getShippingCost();
    $subtotal.text(formatMoney(subtotal));
    $totalAmount.text(formatMoney(total));
  }

  $(document).on("change input", "#cartItems .qty-input", function () {
    updateCartTotals();
  });

  $(document).on("click", ".cart-remove-btn", function () {
    $(this).closest("tr").remove();
    updateCartTotals();
  });

  $(document).on("change", 'input[name="shipping"]', function () {
    updateCartTotals();
  });

  $(document).on("click", ".promo-section .ot-btn-primary", function () {
    updateCartTotals();
  });

  updateCartTotals();

  /* 15. Checkout Form Toggles */
  function syncCheckoutToggle($checkbox, targetSelector) {
    const $target = $(targetSelector);
    if (!$checkbox.length || !$target.length) {
      return;
    }

    if ($checkbox.is(":checked")) {
      $target.addClass("is-open");
    } else {
      $target.removeClass("is-open");
    }
  }

  const $createAccountCheckbox = $("#create_free_account");
  const $shipDiffAddressCheckbox = $("#ship_to_diff_address");

  syncCheckoutToggle($createAccountCheckbox, "#account_create_form");
  syncCheckoutToggle($shipDiffAddressCheckbox, "#shipping_diff_form");

  $(document).on("change", "#create_free_account", function () {
    syncCheckoutToggle($(this), "#account_create_form");
  });

  $(document).on("change", "#ship_to_diff_address", function () {
    syncCheckoutToggle($(this), "#shipping_diff_form");
  });

  /* 16. Header Search Toggle */
  $(".header-search-btn").on("click", function () {
    $(".ot-header-search").addClass("active");
  });
  $(".header-search-close-btn").on("click", function () {
    $(".ot-header-search").removeClass("active");
  });

  /* 17. Magnific Popup Init */
  $('.image-popup').magnificPopup({
    type: 'image'
  });

  $('.video-popup').magnificPopup({
    type: 'iframe'
  });

  /* 18. Counter Up */
  $(".counter-item").each(function () {
    $(this).isInViewport(function (status) {
      if (status === "entered") {
        for (
          var i = 0;
          i < document.querySelectorAll(".odometer").length;
          i++
        ) {
          var el = document.querySelectorAll(".odometer")[i];
          el.innerHTML = el.getAttribute("data-odometer-final");
        }
      }
    });
  });

  /* 19. Video Title Word Wrap */
  $(".video-content-one-title").each(function () {
    const text = $(this).text().trim();
    const words = text.split(" ");

    const wrappedText = words
      .map(word => `<span>${word}</span>`)
      .join(" ");

    $(this).html(wrappedText);
  });

  /* 20. Banner Slider Text Animation */
  function animateActiveSlide($slide) {
    const textElements = $slide.find(".text-split");
    const items = $slide.find(".reveal-item");

    gsap.killTweensOf($slide.find("*"));

    const tl = gsap.timeline();

    textElements.each(function () {
      const el = this;

      if (el.splitType) el.splitType.revert();

      el.splitType = new SplitType(el, {
        types: "words, chars",
        tagName: "span",
      });

      const words = el.querySelectorAll(".word");

      tl.set(el, { autoAlpha: 1 })
        .fromTo(
          words,
          { autoAlpha: 0, x: "1em" },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: { amount: 0.25 },
          },
          ">"
        );
    });

    items.each(function () {
      tl.fromTo(
        this,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        ">+=0.2"
      );
    });
  }

  /* 21. ROI Progress Bar */
  function animateProgressBar() {
    $('.roi-progressbar').each(function () {
      var elementTop = $(this).offset().top;
      var windowBottom = $(window).scrollTop() + $(window).height();

      if (windowBottom > elementTop) {

        if (!$(this).hasClass('animated')) {
          $(this).addClass('animated');

          $(this).find('.progressbar-fill').each(function () {
            var width = $(this).data('width');
            $(this).animate({
              width: width
            }, 1200);
          });

        }

      }
    });
  }

  $(window).on('scroll', animateProgressBar);

  animateProgressBar();

  /* 22. Banner One Slider */
  const $slider = $('.ot-banner-slider-one');
  $slider.on('init', function (e, slick) {
    animateActiveSlide($(slick.$slides[0]));
  });

  $slider.on('afterChange', function (e, slick, current) {
    animateActiveSlide($(slick.$slides[current]));
  });

  $slider.slick({
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    fade: true,
    speed: 900,
    cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
    touchThreshold: 100
  });

  /* 23. Cottage Thumb Slider */
  $('.cottage-thumb-slider').slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    cssEase: 'linear',
  });


  /* 24. Reusable Slick Slider Helper */
  function initSlickSlider($wrappers, settings) {
    $wrappers.each(function () {
      let $wrapper = $(this);
      let $slider = $wrapper.find('.slider');
      let $status = $wrapper.find('.pagingInfo');

      $slider.on('init reInit afterChange', function (event, slick, currentSlide) {
        let i = (currentSlide || 0) + 1;

        $status.html(`
          <span class="total-num">${slick.slideCount < 10 ? '0' : ''}${slick.slideCount}</span>
          /
          <span class="ot-num">${i < 10 ? '0' : ''}${i}</span>
        `);
      });

      $slider.slick({
        ...settings,
        prevArrow: $wrapper.find('.nav-prev'),
        nextArrow: $wrapper.find('.nav-next'),
      });
    });
  }

  /* 25. Facilities Slider */
  initSlickSlider($('.facilities-wrapper'), {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: $('.facilities-slider-nav.nav-prev'),
    nextArrow: $('.facilities-slider-nav.nav-next'),
    autoplay: true,
    cssEase: 'ease-out',
    centerMode: true,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          centerMode: false,
        }
      }
    ]
  });

  /* 26. Rooms Slider */
  initSlickSlider($('.ot-rooms-slider-wrapper'), {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: $('.ot-rooms-slider-nav.nav-prev'),
    nextArrow: $('.ot-rooms-slider-nav.nav-next'),
    autoplay: true,
    cssEase: 'linear',
    centerMode: true,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          variableWidth: false,
        }
      }
    ]
  });

  function restartRoomTabSlider($slider) {
    if (!$slider.hasClass('slick-initialized')) {
      return;
    }

    $slider.slick('slickPause');
    $slider.slick('setPosition');
    $slider.slick('slickGoTo', 0, true);

    window.setTimeout(function () {
      $slider.slick('setPosition');
      $slider.slick('slickPlay');
    }, 120);
  }

  function syncRoomTabSliders($roomArea) {
    const $panes = $roomArea.find('.tab-pane');

    $panes.each(function () {
      const $pane = $(this);
      const $slider = $pane.find('.ot-rooms-slider-one');

      if (!$slider.hasClass('slick-initialized')) {
        return;
      }

      if ($pane.hasClass('active') && $pane.hasClass('show')) {
        restartRoomTabSlider($slider);
      } else {
        $slider.slick('slickPause');
      }
    });
  }

  $('.ot-room-area').each(function () {
    const $roomArea = $(this);

    syncRoomTabSliders($roomArea);

    $roomArea.find('[data-bs-toggle="tab"]').on('shown.bs.tab', function (event) {
      syncRoomTabSliders($roomArea);

      const targetSelector = $(event.target).attr('data-bs-target');
      const $targetSlider = $roomArea.find(targetSelector).find('.ot-rooms-slider-one');

      window.setTimeout(function () {
        restartRoomTabSlider($targetSlider);
      }, 120);
    });
  });

  /* 27. Team Slider */
  $('.ot-team-slider').slick({
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  });

  /* 28. Testimonial Slider */
  $('.ot-testimonial-slider').slick({
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    prevArrow: '<span class="prev"><i class="ri-arrow-left-line"></i></span>',
    nextArrow: '<span class="next"><i class="ri-arrow-right-line"></i></span>',
    autoplay: true,
    pauseOnHover: true,
    cssEase: 'linear',
  });

  /* 29. Vertical Testimonial Nav Slider */
  $('.testimonial-content-slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    vertical: true,
    verticalScrolling: true,
    asNavFor: '.testimonial-client-slider'
  });

  $('.testimonial-client-slider').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: '.testimonial-content-slider',
    dots: false,
    arrows: false,
    centerMode: true,
    centerPadding: '0px',
    focusOnSelect: true,
    vertical: true,
    verticalScrolling: true,
    autoplay: true,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          vertical: false,
          verticalScrolling: false,
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          centerMode: false,
          vertical: false,
          verticalScrolling: false,
        }
      }
    ]
  });

  /* 30. Ticker Slider */
  $('.ot-ticker-slider-one').slick({
    dots: false,
    infinite: true,
    speed: 300,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 0,
    speed: 8000,
    pauseOnHover: false,
    cssEase: 'linear',
    variableWidth: true
  });

  /* 31. Testimonial Slider Three */
  $(".ot-testimonial-slider-three").slick({
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: $('.testimonial-nav-one.nav-prev'),
    nextArrow: $('.testimonial-nav-one.nav-next'),
    autoplay: true,
    cssEase: 'linear',
  });

  /* 32. Testimonial Slider One With Thumbs */
  $('.testimonial-content-slider-one').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    asNavFor: '.ot-testimonial-main-thumb-slider, .testimonial-thumb-slider',
    dots: true
  });

  $('.ot-testimonial-main-thumb-slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    arrows: false,
    fade: true,
    asNavFor: '.testimonial-content-slider-one, .testimonial-thumb-slider'
  });

  $('.testimonial-thumb-slider').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: '.testimonial-content-slider-one, .ot-testimonial-main-thumb-slider',
    focusOnSelect: true,
    vertical: true,
    arrows: false,
    dots: false,
    centerMode: true,
    centerPadding: '0px',
  });

  /* 33. Service Details Thumb Slider */
  $(".service-details-thumb-slider").slick({
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    cssEase: 'linear',
  });

  /* 34. Blog Thumb Slider */
  $(".blog-thumb-slider").slick({
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: '<span class="prev"><i class="bi bi-arrow-left"></i></span>',
    nextArrow: '<span class="next"><i class="bi bi-arrow-right"></i></span>',
    autoplay: true,
    cssEase: 'linear',
  });

  /* 35. Department Slider */
  $(".ot-department-slider").slick({
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    fade: true,
    cssEase: 'linear',
  });

  /* 36. Testimonial Slider Four */
  $('.testimonial-content-slider-four').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: $('.testimonial-content-arrow.arrow-left'),
    nextArrow: $('.testimonial-content-arrow.arrow-right'),
    asNavFor: '.testimonial-nav-slider',
    vertical: true,
  });

  $('.testimonial-nav-slider').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: '.testimonial-content-slider-four',
    dots: false,
    arrows: false,
    centerMode: true,
    centerPadding: '0px',
    focusOnSelect: true
  });

  /* 37. Banner Four Thumb Slider */
  $('.banner-four-thumb-slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: $('.banner-four-thumb-arrow.arrow-left'),
    nextArrow: $('.banner-four-thumb-arrow.arrow-right'),
    asNavFor: '.banner-four-thumb-nav-slider',
    vertical: true,
  });

  $('.banner-four-thumb-nav-slider').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: '.banner-four-thumb-slider',
    dots: false,
    arrows: false,
    vertical: true,
    centerMode: true,
    centerPadding: '0px',
    focusOnSelect: true
  });

  /* 38. Swiper Facilities Slider */
  let facilitiesSlider = new Swiper('.facilities-slider-active', {
    slidesPerView: 'auto',
    loop: true,
    autoplay: true,
    speed: 2000,
    effect: 'slide',
    spaceBetween: 24,
    breakpoints: {
      1600: {
        slidesPerView: 4,
      },
      1400: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 1,
      },
      992: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 1,
      },
      576: {
        slidesPerView: 1,
      },
      0: {
        slidesPerView: 1,
      },
    },
    navigation: {
      prevEl: '.nav-prev',
      nextEl: '.nav-next',
    },

    pagination: {
      el: '.pagingInfo',
      type: 'fraction',
      renderFraction: function (currentClass, totalClass) {
        return (
          '<span class="' + totalClass + '"></span>' +
          ' / ' +
          '<span class="' + currentClass + '"></span>'
        );
      },
      formatFractionCurrent: n => (n < 10 ? '0' + n : n),
      formatFractionTotal: n => (n < 10 ? '0' + n : n),
    },
  });

  /* 39. Swiper Product Slider */
  let productSlide = new Swiper('.ot-product-active', {
    slidesPerView: 4,
    loop: true,
    autoplay: true,
    speed: 1500,
    spaceBetween: 30,
    effect: 'slide',
    fadeEffect: {
      crossFade: true,
    },
    breakpoints: {
      '1600': {
        slidesPerView: 4,
      },
      '1400': {
        slidesPerView: 4,
      },
      '1200': {
        slidesPerView: 4,
      },
      '992': {
        slidesPerView: 3,
      },
      '768': {
        slidesPerView: 2,
      },
      '576': {
        slidesPerView: 1,
      },
      '0': {
        slidesPerView: 1,
      },
    },
    navigation: {
      prevEl: '.ot-prev',
      nextEl: '.ot-next',
    }

  });

  /* 40. Shop Price Range Slider */
  function initShopPriceRange() {
    const $range = $("#slider-range");
    const $amount = $("#amount");

    if (!$range.length || !$amount.length || typeof $.fn.slider !== "function") {
      return;
    }

    const defaultMin = 30;
    const defaultMax = 150;
    const startMin = 30;
    const startMax = 150;

    const formatRangeValue = (minValue, maxValue) => `Price : ${minValue}$ - ${maxValue}$`;
    const syncSliderClasses = () => {
      $range.removeClass("ui-corner-all");
      $range.find(".ui-slider-range, .shop-range-selected")
        .removeClass("ui-slider-range ui-corner-all ui-widget-header")
        .addClass("shop-range-selected");

      $range.find(".ui-slider-handle, .shop-range-handle").each(function (index) {
        $(this)
          .removeClass("ui-slider-handle ui-corner-all ui-state-default ui-state-active")
          .addClass("shop-range-handle")
          .attr("aria-label", index === 0 ? "Minimum price" : "Maximum price");
      });
    };

    if ($range.hasClass("ui-slider")) {
      $range.slider("destroy");
    }

    $range.slider({
      range: true,
      min: defaultMin,
      max: defaultMax,
      values: [startMin, startMax],
      slide: function (event, ui) {
        syncSliderClasses();
        $amount.val(formatRangeValue(ui.values[0], ui.values[1]));
      },
      start: function () {
        syncSliderClasses();
        $range.find(".shop-range-handle").addClass("is-active");
      },
      stop: function () {
        syncSliderClasses();
        $range.find(".shop-range-handle").removeClass("is-active");
      },
      create: function () {
        syncSliderClasses();
        const values = $range.slider("values");
        $amount.val(formatRangeValue(values[0], values[1]));
      }
    });

    $(".shop-filter-clear-btn").on("click", function () {
      $range.slider("values", [startMin, startMax]);
      $amount.val(formatRangeValue(startMin, startMax));
    });

    $(".shop-filter-btn").on("click", function () {
      const values = $range.slider("values");
      $amount.val(formatRangeValue(values[0], values[1]));
      $range.trigger("shop:price-filter", [values]);
    });
  }

  initShopPriceRange();


  /* 41. Nice Select Init */
  $('select').niceSelect();


})(jQuery);
