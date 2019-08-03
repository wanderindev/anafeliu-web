(function(app, $, Sentry) {
    $(document).ready(function() {
        let headerLogo$ = $(".header-logo");
        let navbarMenu$ = $(".navbar-menu");
        let navbarItem$ = $(".navbar-end a.navbar-item");
        let navbarBurger$ = $(".navbar-burger");
        let iframe$ = $('.aromatico-iframe');

        // Init Sentry
        Sentry.init({ dsn: 'https://456a67b26d574f609ea315fdc982b469@sentry.io/1520877' });


        // Check for click events on the navbar burger icon
        navbarBurger$.click(function() {
            // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            navbarBurger$.toggleClass("is-active");
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

        // Parses the website data.
        $.getJSON('data.json', function(data) {
            app.siteData = data;
        });

        // Sets back to top button behavior.
        $(window).scroll(function(){
            if ($(this).scrollTop() > 400) {
                $('.top-scroller').fadeIn();
            } else {
                $('.top-scroller').fadeOut();
            }
        });

        $('.top-scroller').click(function(){
            $('html, body').animate({scrollTop : 0},1000);
            return false;
        });

        app.openFB = function(index){
            let imgs = app.siteData.galleries.graphics[index - 1].images;
            let iframe = app.siteData.galleries.graphics[index - 1].iframe;
            let fbItems = [];

            if (imgs) {
                imgs.forEach(function(img) {
                    fbItems.push({
                        src: "img/" + img,
                        type: "image"
                    });
                });
            } else {
                fbItems.push({
                    src: iframe,
                    type: "iframe"
                });
            }

            console.log(fbItems);
            $.fancybox.open(fbItems);
        };

        if (iframe$.length) {
            let h = $(window).height();
            iframe$.css('height', h + 'px');
            $('html').css('overflow', 'hidden');
        }

    });
})(window.app = window.app || {}, jQuery, Sentry);
