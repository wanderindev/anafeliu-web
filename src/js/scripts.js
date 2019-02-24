$(document).ready(function() {
    var headerLogo$ = $(".header-logo");
    var navbarMenu$ = $(".navbar-menu");
    var navbarItem$ = $(".navbar-end a.navbar-item");
    var navbarBurger$ = $(".navbar-burger");


    // Check for click events on the navbar burger icon
    navbarBurger$.click(function() {
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        $(".navbar-burger").toggleClass("is-active");
        navbarMenu$.toggleClass("is-active");
        navbarItem$.toggleClass("is-active");
        headerLogo$.toggleClass("is-active");

        // Add menu animation
        if (navbarMenu$.hasClass("is-active")) {
            navbarMenu$.css({
                "animation-name": "menu-in",
                "animation-duration": ".75s"
            });
            headerLogo$.css({
                "animation-name": "hide-logo",
                "animation-duration": ".75s"
            });
            navbarItem$.css({
                "animation-name": "show-menu-item",
                "animation-duration": "1.5s"
            });
        } else {
            navbarMenu$.css({
                "animation-name": "menu-out",
                "animation-duration": ".75s"
            });
            headerLogo$.css({
                "animation-name": "show-logo",
                "animation-duration": ".75s"
            });
            navbarItem$.css({
                "animation-name": "hide-menu-item",
                "animation-duration": ".75s"
            });
        }
    });
});
