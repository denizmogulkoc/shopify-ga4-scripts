<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','{{GTM-ID}}');</script>
<!-- End Google Tag Manager -->

<script type="text/javascript">
    window.dataLayer = window.dataLayer || [];
    window.analyticahouse = {
        "multi_currency" : false, //Set this true if you're using Shopify's multi-currency solution. It must contain the "shopify-currency-form" class.
        "pageFly" : false, //Set this true if you are using PageFly in your website
        "send_unhashed_email": false, //Set this true if you would like to collect unhashed email address of logged in users.
        "g_feed_region": "TR", //Change this if your Google Ads feed is in another region
        //Modify the following button attributes if you do not see any ee_addToCart datalayer event when you click add to cart button in any product detail page.
        "addtocart_btn_attributes": {
            "name": ["add-to-cart", "add"],
            "class": ["product-form__cart-submit", "product-form__add-to-cart", "gtmatc", "product__add-to-cart"],
        },
        //Modify the following element attribute if you see that quantity being pushed to datalayer is wrong when you try to add the a product to the cart with more than 1 as quantity.
        "product_quantity":{
            "name": ["quantity"]
        },
        //Modify the following button attributes if you do not see any ee_removeFromCart datalayer event when you remove any item from the cart in the cart page.
        "removefromcart_btn_attributes": {
            "data-remove-item": ["cart-template"],
            "data-cart-remove": ["Remove"],
            "aria-label": ["Remove"],
            "class": ["ajaxcart__qty--minus", "cart__remove-btn", "cart__remove", "cart__removee", "cart-item__remove", "item-remove"],
            "id": [],
            "href": ["/cart/change?id=", "/cart/change?line="]
        },
        //Modify the following button attributes if you do not see ee_checkout datalayer event when you click "checkout" button in the cart page or cart drawer.
        "checkout_btn_attributes": {
            "name": ["checkout"],
            "class": ["checkout-btn", "upcart-checkout-button", "cart__submit"],
            "href": ["/checkout"]
        },
        //Modify the following button attributes if you do not see any ee_productClick datalayer event when you click to a product in collection pages.
        "collection_prod_click_attributes":{
            "href": ["/collections/"]
        },
        //Modify the following button attributes if you do not see any ee_addToCart datalayer event when you click add to cart button in any collection pages.
        "collection_atc_attributes":{
        },
        //Modify the following button attributes if you do not see any ee_productClick datalayer event when you click to a product in search result pages.
        "search_prod_click_attributes":{
            "href": ["/products/"]
        },
        "version": "0.1", //analyticahouse version installed to this store
        "logging": true, //Enable this to see analyticahouse logs in console
        "logs": [],
        "stopAtLog": true //To use a debugger while logging
    };

    analyticahouse.log = function(t) {
        if (window.analyticahouse.logging == true && t !== null) {
            if (typeof(t) == "object") {
                window.console.log("** analyticahouse Logger:");
                window.console.log(t);
            } else {
                window.console.log("** analyticahouse Logger: " + t);
            }

            analyticahouse.logs.push(t);
            if (analyticahouse.stopAtLog == true) {
                debugger;
            }
        }
    };
    window.analyticahouse.Initialize = function() {
        window.analyticahouse.loadScript = function(callback) {
            callback();
        }

        window.analyticahouse.AppStart = function(){

            var shop_currency = '{{ shop.currency }}';
            var shop_moneyformat = '{{ shop.money_format }}';
            var shop_money_with_currency_format = '{{ shop.money_with_currency_format }}';

            if(analyticahouse.multi_currency == true){
                var detected_currency = shop_money_with_currency_format.replace(shop_moneyformat,"").trim();
            }else{
                var detected_currency = shop_currency;
            }

            {% assign template_name = template.name %}

            var user_info_obj = {
                event: "user_info",
                page_type: {{ template_name | replace: "index", "homepage" | default: 'other' | capitalize | json }},
                page_currency: detected_currency,
                user: {
                    {% if customer %}
                    type: "member",
                    user_id: `{{ customer.id | remove: "'" | remove: '"' }}`,
                    last_order: `{{ customer.last_order.created_at | date: "%B %d, %Y %I:%M%p" }}`,
                    orders_count: `{{ customer.orders_count }}`,
                    total_spent: `{{ customer.total_spent | money_without_currency }}`,
                    email_sha256: `{{ customer.email | sha256 }}`,
                    email_sha1: `{{ customer.email | sha1 }}`,
                    {% else %}
                    type: "visitor"
                    {% endif %}
                }
            }
            {% if customer %}
            if (analyticahouse.send_unhashed_email == true) {
                user_info_obj["email"] = `{{ customer.email}}`;
            }
            {% endif %}

            window.dataLayer.push(user_info_obj);
          
window.analyticahouse.GetClickedProductPosition = function(elementHref, sku){
    if(sku != ''){
        var collection = {{ collection | json }};
        {% for product in collection.products %}
        var collectionProductsSku = `{{ product.selected_or_first_available_variant.sku | remove: "'" | remove: '"' }}`;
        if(sku == collectionProductsSku) {return {{ forloop.index }} ;}
        {% endfor %}
        return 0;
    }else{
        var elementIndex = -1;
        collectionProductsElements = document.querySelectorAll('a[href*="/products/"]');
        collectionProductsElements.forEach(function(element,index){
            if (element.href.includes(elementHref)) {elementIndex = index + 1};
        });
        return elementIndex;
    }
};

window.analyticahouse.CollectionPageHandle = function(){
    var collection = {{ collection | json }};
    var collectionTitle = `{{ collection.title | remove: "'" | remove: '"' }}`;
    var collectionId = `{{ collection.id }}`;

    var items = [];

    {% for product in collection.products %}
    var item = {
        item_id: `{{ product.id }}`,
        item_name: `{{ product.title | remove: "'" | remove: '"' }}`,
        item_brand: `{{ product.vendor | remove: "'" | remove: '"' }}`,
        item_category: collectionTitle,
        item_variant: `{{ product.selected_or_first_available_variant.title | default: product.variants[0].title }}`,
        price: {{ product.variants.first.price | times: 0.01 }},
        currency: detected_currency,  // assuming detected_currency is defined elsewhere
        item_list_id: collectionId,
        item_list_name: collectionTitle,
        index: {{ forloop.index }},
        g_product_id: `shopify_` + analyticahouse.g_feed_region + `_` + `{{ product.id }}` + `_` + `{{ product.selected_or_first_available_variant.id | default: product.variants[0].id }}`,
        variant_id: `{{ product.selected_or_first_available_variant.id | default: product.variants[0].id }}`,
        product_type: `{{ product.type | remove: "'" | remove: '"' }}`,
        product_sku: `{{ product.selected_or_first_available_variant.sku | remove: "'" | remove: '"' }}`
    };
    items.push(item);
    {% endfor %}

    window.dataLayer.push({
        event: 'view_item_list',
        ecommerce: {
            item_list_id: collectionId,
            item_list_name: collectionTitle,
            items: items
        }
    });
};


window.analyticahouse.SearchPageHandle = function(){
    var searchTerm = `{{ search.terms }}`;
    var searchResults = parseInt(`{{ search.results_count }}`);
    var searchResultsJson = {{ search.results | json }};

    var items = [];

    {% for product in search.results %}
    var item = {
        item_id: `{{ product.id }}`,
        item_name: `{{ product.title | remove: "'" | remove: '"' }}`,
        item_brand: `{{ product.vendor | remove: "'" | remove: '"' }}`,
        item_category: 'Search',  // Assuming 'Search' as a generic category for search results
        item_variant: `{{ product.selected_or_first_available_variant.title | default: product.variants[0].title }}`,
        price: {{ product.variants.first.price | times: 0.01 }},
        currency: detected_currency,  // assuming detected_currency is defined elsewhere
        item_list_id: 'search',
        item_list_name: 'Search',
        index: {{ forloop.index }},
        g_product_id: `shopify_` + analyticahouse.g_feed_region + `_` + `{{ product.id }}` + `_` + `{{ product.selected_or_first_available_variant.id | default: product.variants[0].id }}`,
        variant_id: `{{ product.selected_or_first_available_variant.id | default: product.variants[0].id }}`,
        product_type: `{{ product.type | remove: "'" | remove: '"' }}`,
        product_sku: `{{ product.selected_or_first_available_variant.sku | remove: "'" | remove: '"' }}`
    };
    items.push(item);
    {% endfor %}

    window.dataLayer.push({
        event: 'search_list',
        page_type: 'search',
        search_term: searchTerm,
        search_results: searchResults,
        ecommerce: {
            item_list_id: 'search',
            item_list_name: 'Search',
            items: items
        }
    });
};


window.analyticahouse.ProductPageHandle = function(){
    var productJson = {{ product | json}};
    var productName = `{{ product.title | remove: "'" | remove: '"' }}`;
    var productId = `{{ product.id }}`;
    var productPrice = `{{ product.variants.first.price | times: 0.01 }}`;
    var productBrand = `{{ product.vendor | remove: "'" | remove: '"' }}`;
    var productType = `{{ product.type | remove: "'" | remove: '"' }}`;
    var productSku = `{{ product.selected_or_first_available_variant.sku | remove: "'" | remove: '"' }}`;
    var collectionTitle = `{{ product.collections.last.title | remove: "'" | remove: '"' }}`;
    var collectionId = `{{ product.collections.last.id | remove: "'" | remove: '"' }}`;

    var item = {
        item_id: productId,
        item_name: productName,
        item_brand: productBrand,
        item_category: collectionTitle,
        item_variant: `{{ product.selected_or_first_available_variant.title | remove: "'" | remove: '"' }}`,
        price: productPrice,
        currency: detected_currency, // assuming detected_currency is defined elsewhere
        item_list_id: collectionId,
        item_list_name: collectionTitle,
        product_type: productType,
        product_sku: productSku,
        g_product_id: `shopify_` + analyticahouse.g_feed_region + `_` + productId + `_` + `{{ product.selected_variant.id | default: product.variants[0].id }}`,
        variant_id: `{{ product.selected_variant.id | default: product.variants[0].id }}`
    };

    window.dataLayer.push({
        event: 'view_item',
        ecommerce: {
            items: [item]
        }
    });
};


window.analyticahouse.cartPageHandle = function(){
    var cartTotalValue = parseFloat(`{{ cart.total_price | times: 0.01 }}`);
    
    fetch('/cart.js')
        .then(response => response.json())
        .then(cartItemsJson => {
            var items = [];
            var cartTotalQuantity = 0;

            for (var i = 0; i < cartItemsJson.items.length; i++) {
                var item = {
                    item_id: cartItemsJson.items[i].id.toString(),
                    item_name: cartItemsJson.items[i].product_title,
                    item_brand: cartItemsJson.items[i].vendor,
                    item_category: 'Cart', // Assuming 'Cart' as a generic category for cart items
                    item_variant: cartItemsJson.items[i].variant_title,
                    price: (cartItemsJson.items[i].price / 100).toFixed(2),
                    currency: detected_currency, // assuming detected_currency is defined elsewhere
                    item_list_id: 'cart',
                    item_list_name: 'Cart',
                    product_type: cartItemsJson.items[i].product_type,
                    product_sku: cartItemsJson.items[i].sku,
                    g_product_id: `shopify_` + cartItemsJson.items[i].id + `_` + cartItemsJson.items[i].variant_id,
                    variant_id: cartItemsJson.items[i].variant_id.toString(),
                    quantity: cartItemsJson.items[i].quantity
                };
                items.push(item);
                cartTotalQuantity += cartItemsJson.items[i].quantity;
            }

            window.dataLayer.push({
                event: 'view_cart',
                ecommerce: {
                    items: items,
                    value: cartTotalValue,
                    totalQuantity: cartTotalQuantity
                }
            });
        });
};


            var found_element = [];
            var found_atc_element_form = [];

            window.findElemInPath = function(pth_arr, attr_obj) {
                var i;
                var btn_found = null;

                for (i = 0; i < pth_arr.length; i++) {
                    for (var k in attr_obj) {
                        if (attr_obj.hasOwnProperty(k)) {
                            var attribute_name = k;
                            var attribute_values = attr_obj[k];

                            if (pth_arr[i].hasAttribute !== undefined) {
                                if (pth_arr[i].hasAttribute(attribute_name) == true) {
                                    attribute_values.forEach(function(selected_value) {
                                        if (pth_arr[i].getAttribute(attribute_name).indexOf(selected_value) > -1) {
                                            analyticahouse.log(selected_value + " found in " + attribute_name + " attribute list.");
                                            btn_found = pth_arr[i];
                                            found_element.push(pth_arr[i]);
                                            found_atc_element_form.push(pth_arr[i].closest("form[action='/cart/add']"));
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
                return btn_found;
            }

            document.addEventListener("click", (event) => {
                found_element = [];
                found_atc_element_form = [];
                var checkout_elem = window.findElemInPath(event.path, analyticahouse.checkout_btn_attributes);
                var rfc_elem = window.findElemInPath(event.path, analyticahouse.removefromcart_btn_attributes);
                {% case template_name %}
                {%- when 'product' -%}
                var atc_elem = window.findElemInPath(event.path, analyticahouse.addtocart_btn_attributes);
                {% when 'collection' %}
                var col_prod_click_elem = window.findElemInPath(event.path, analyticahouse.collection_prod_click_attributes);
                var coll_atc_elem = window.findElemInPath(event.path, analyticahouse.collection_atc_attributes);
                {% when 'search' %}
                var search_prod_click_elem = window.findElemInPath(event.path, analyticahouse.search_prod_click_attributes);
                {% endcase %}
                if (checkout_elem !== null) {
                    analyticahouse.checkoutEventFunc();
                }else if(rfc_elem !== null) {
                    analyticahouse.rfcEventFunc();
                }
                        {%- case template_name -%}
                        {%- when 'product' -%}
                else if(atc_elem !== null) {
                    analyticahouse.atcEventFunc();
                }
                        {%- when 'collection' -%}
                else if(col_prod_click_elem !== null){
                    analyticahouse.colProdClickFunc();
                }else if(coll_atc_elem !== null) {
                    analyticahouse.collAtcEventFunc();
                }
                        {%- when 'search' -%}
                else if(search_prod_click_elem !== null){
                    analyticahouse.searchProdClickFunc();
                }
                        {% endcase %}
                else{
                    analyticahouse.log("The clicked button/link was not a addtocart, removefromcart or checkout button.");
                    analyticahouse.log(event);
                }
                if(event.target.classList.contains('product-form__add-btn') || event.target.closest('.product-form__add-btn')){
                  analyticahouse.quickViewAtcEventFunc(event);
                }
            });



            window.analyticahouse.rfcEventFunc = function(){
                var removedItem = [];
                if(found_element.length > 0){
                    if(found_element[0].hasAttribute("data-vid")){
                        var rfc_variant_id = found_element[0].getAttribute("data-vid");
                    }else if(found_element[0].hasAttribute("data-id")){
                      var rfcc_variant_id = found_element[0].getAttribute("data-id").split(':')[0];
                    } else if(found_element[0].hasAttribute("href")) {
                        if(found_element[0].getAttribute("href").includes(":")) {
                            var rfc_variant_id_1 = found_element[0].getAttribute("href").split(":")[0];
                            var rfc_variant_id = rfc_variant_id_1.split("id=")[1];
                        } else if(found_element[0].getAttribute("href").includes("/cart/change?line=")) {
                            var productCartOrder_1 = found_element[0].getAttribute("href").split("change?line=")[1];
                            var productCartOrder = productCartOrder_1.split("&quantity")[0];
                        }

                    }
                    if(rfc_variant_id) {
                        var removedItemData = cartItemsJson.items.filter(function(item){
                            return item.variant_id.toString() === rfc_variant_id
                        });
                        removedItem.push(removedItemData[0]);
                    }else if(rfcc_variant_id){
                      fetch('/cart.js').then((response) => response.json())
                        .then((data) => {
                            data['items'].forEach(function (item, index) {
                              if (item['id'] == rfcc_variant_id){
                                window.dataLayer.push({
                                    event:'ee_removeFromCart',
                                    product_id : item['product_id'],
                                    product_name: item['product_title'],
                                    variant_id : item['id'],
                                    variant_title: item['variant_title'],
                                    product_price: (item['price'] / 100).toFixed(2).toString(),
                                    currency: detected_currency,
                                    product_brand: item['vendor'],
                                    quantity: item['quantity']
                                });
                              }
                            });
                        });
                    } else if(productCartOrder) {
                        for (var i = 0; i < cartItemsJson.items.length; i++) {
                            if( i + 1 ==  productCartOrder){
                                removedItem.push(cartItemsJson.items[i]);
                            }
                        }
                    } else {
                        analyticahouse.log("Removed element product id not found");
                    }

                    if(removedItem[0]) {
                        window.dataLayer.push({
                            event:'ee_removeFromCart',
                            product_id : removedItem[0].product_id,
                            product_name: removedItem[0].product_title,
                            variant_id : removedItem[0].id,
                            variant_title: removedItem[0].variant_title,
                            product_price: (removedItem[0].price / 100).toFixed(2).toString(),
                            currency: detected_currency,
                            product_brand: removedItem[0].vendor,
                            quantity: removedItem[0].quantity
                        });
                        analyticahouse.log("Product ee_removeFromCart==>", window.dataLayer);
                    }

                } else{
                    analyticahouse.log("Removed element not found");
                }
                removedItem = [];
            }


            {% case template_name %}
            {% when 'product' %}
            window.onload = function(){
                if( analyticahouse.pageFly == true){
                    var element = document.querySelector('[data-pf-type="ProductATC"]');
                    element.setAttribute("onclick", "analyticahouse.atcEventFunc()");
                }
            }
            {% endcase %}

            window.analyticahouse.atcEventFunc = function(){

                {{ productInfos }}

                if( analyticahouse.pageFly == false){
                    if(document.querySelector('form[action="/cart/add"]')){
                        var productForm = document.querySelector('form[action="/cart/add"]');
                        if(Array.from(productForm.elements).find(item => item.name == 'id')){
                            var formVariantInput = Array.from(productForm.elements).find(item => item.name == 'id').value;
                        }
                    }
                }

                var initial_url = window.location.href;
                var urlVariantInput = initial_url.split( 'variant=' )[1];

                if (formVariantInput){
                    var variantInput = formVariantInput;
                } else if(urlVariantInput){
                    var variantInput = urlVariantInput;
                } else{
                    var variantInput = '{{ product.selected_or_first_available_variant.id }}';
                }

                for (let i = 0; i < productJson.variants.length; i++) {
                    if(productJson.variants[i].id == variantInput){
                        var productPrice = productJson.variants[i].price;
                        var variantSku = productJson.variants[i].sku;
                        var variantName = productJson.variants[i].public_title;
                    }
                }

                var found_qty = [];

                window.findQty = function(attr_obj) {
                    found_qty = [];
                    for (var k in attr_obj) {
                        if (attr_obj.hasOwnProperty(k)) {
                            var attribute_name = k;
                            var attribute_values = attr_obj[k];
                            var qtyEl = document.querySelector('['+attribute_name+'="'+attribute_values+'"]');
                            if(qtyEl && qtyEl.value){
                                found_qty.push(qtyEl.value);
                            }
                        }
                    }
                }

                window.findQty(analyticahouse.product_quantity);

                if (found_qty.length > 0) {
                    var prodQty = found_qty[0];
                } else{
                    var prodQty = 1;
                }

                window.dataLayer.push({
                    event: 'ee_addToCart',
                    product_name: productName,
                    product_id: productId,
                    product_price: (productPrice / 100).toFixed(2).toString(),
                    currency: detected_currency,
                    product_brand: productBrand,
                    product_type: productType,
                    category_id: collectionId,
                    category_title: collectionTitle,
                    quantity: prodQty,
                    variant_id: variantInput,
                    variant_title: variantName,
                    product_sku : variantSku,
                    g_product_id: `shopify_`+ analyticahouse.g_feed_region +`_`+productId+`_`+variantInput
                });
                analyticahouse.log("Product ee_addToCart==>");
                analyticahouse.log(window.dataLayer);
            }

            window.analyticahouse.collAtcEventFunc = function(){
                {{collectionInfos}}
                var formElement = found_atc_element_form[0];
                if(formElement.getAttribute("data-productid")){
                    var productId = formElement.getAttribute("data-productid");
                } else if(formElement.querySelector('.pid').value){
                    var productId = formElement.querySelector('.pid').value;
                    console.log(productId);
                }

                var addedProduct = collectionAllProducts.filter(function(product) {
                    return product.id == Number(productId);
                });


                if (addedProduct.length == 0 ) return;
                window.dataLayer.push({
                    event: 'ee_addToCart',
                    product_name: addedProduct[0].title,
                    product_id : addedProduct[0].id.toString(),
                    product_price: (addedProduct[0].price / 100).toFixed(2).toString(),
                    product_brand: addedProduct[0].vendor,
                    currency: detected_currency,
                    product_type: addedProduct[0].type,
                    category_id: collectionId,
                    category_title: collectionTitle,
                    variant_id: addedProduct[0].variants[0].id,
                    variant_title: addedProduct[0].variants[0].title,
                    product_sku: addedProduct[0].variants[0].sku
                });
                analyticahouse.log("Product ee_addToCart==>");
                analyticahouse.log(window.dataLayer);
            }

            window.analyticahouse.colProdClickFunc = function(){
                {{ collectionInfos }}

                var href = found_element[0].getAttribute("href");
                var handle = href.split('/collections/')[1];
                var clickedProduct = collectionAllProducts.filter(function(product) {
                    return product.handle === handle;
                });

                if (clickedProduct.length == 0 ) return;
                window.dataLayer.push({
                    event: 'ee_productClick',
                    product_id : clickedProduct[0].id.toString(),
                    product_name: clickedProduct[0].title,
                    product_type: clickedProduct[0].type,
                    product_sku: clickedProduct[0].variants[0].sku,
                    product_brand: clickedProduct[0].vendor,
                    product_price: (clickedProduct[0].price / 100).toFixed(2).toString(),
                    category_id: collectionId,
                    category_name: collectionTitle,
                    currency: detected_currency,
                    product_position: analyticahouse.GetClickedProductPosition(href, clickedProduct[0].variants[0].sku),
                    variant_id: clickedProduct[0].variants[0].id,
                    variant_title: clickedProduct[0].variants[0].title
                });
            }

            window.analyticahouse.searchProdClickFunc = function(){
                {{ searchInfos }}

                var href = found_element[0].getAttribute("href");
                var handle = href.split('/products/')[1];
                var clickedProduct = searchResultsJson.filter(function(product) {
                    return product.handle === handle;
                });

                if (clickedProduct.length == 0 ) return;
                window.dataLayer.push({
                    event: 'ee_productClick',
                    product_id : clickedProduct[0].id,
                    product_name: clickedProduct[0].title,
                    product_type: clickedProduct[0].type,
                    product_sku: clickedProduct[0].variants[0].sku,
                    product_price: (clickedProduct[0].price / 100).toFixed(2).toString(),
                    currency: detected_currency,
                    product_brand: clickedProduct[0].vendor,
                    product_position: analyticahouse.GetClickedProductPosition(href, ""),
                    variant_id: clickedProduct[0].variants[0].id,
                    variant_title: clickedProduct[0].variants[0].title
                });
            }
            window.analyticahouse.quickViewAtcEventFunc = function(event){
              var formElement = event.target.closest('form');
              if(formElement !== null){
              	var ptitle = formElement.querySelector('.ptitle')
              	if(ptitle !== null){
              		window.dataLayer.push({
		                event: 'ee_addToCart',
		                product_name: formElement.querySelector('.ptitle').value,
		                product_id : formElement.querySelector('.pid').value,
		                product_price: formElement.querySelector('.pprice').value,
		                product_brand: formElement.querySelector('.pbrand').value,
		                currency: detected_currency,
		                product_type: formElement.querySelector('.ptype').value,
		                category_id: formElement.querySelector('.pcategory_id').value,
		                category_title: formElement.querySelector('.pcategory_name').value,
		                variant_id: formElement.querySelector('*[name="id"]').value,
		                variant_title: formElement.querySelector('.pvtitle').value,
		                product_sku: formElement.querySelector('.psku').value,
		                quantity: formElement.querySelector('input[name="quantity"]') || 1
		              });
              	}
              }
              
            }

            {% case template_name %}
            {% when 'collection' %}
            analyticahouse.CollectionPageHandle()
            {% when 'search' %}
            analyticahouse.SearchPageHandle()
            {% when 'product' %}
            analyticahouse.ProductPageHandle()
            {% when 'cart' %}
            analyticahouse.cartPageHandle()
            {% endcase %}

        }
    }

    analyticahouse.Initialize();
    analyticahouse.loadScript(function() {
        analyticahouse.AppStart();
    });
</script>

