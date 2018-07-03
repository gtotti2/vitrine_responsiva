    var $ = jQuery;
    function vitrineLoader(lista, el) {
        var showcaseProducts,
            htmlShowcase,
            htmlShowCaseAspirational,
            warranty,
            insurance,
            classBtnDefault,
            indice,
            typeInfo = $(el).data('info'),
            tipoVitrine = $(el).data('vitrine').tipo,
            productsList = [];

        $.each(lista.products, function (index, val) {

            indice = index + 1;

            showcaseProducts = lista.products[index];

            warranty = showcaseProducts.has_garantia;

            insurance = showcaseProducts.has_seguro;

            classBtnDefault = 'add-cart check-services btn-secondary btn-full icon icon-carrinho icon-btn';

            if (warranty === 'sim' && insurance === 'nao') {
                classBtnDefault = classBtnDefault + 'product-has-warranty';
            } else if (insurance === 'sim' && warranty === 'não') {
                classBtnDefault = classBtnDefault + 'product-has-insurance';
            } else if (warranty === 'sim' && insurance === 'sim') {
                classBtnDefault = classBtnDefault + 'product-has-warranty product-has-insurance';
            }

            var productObj = {
                name: showcaseProducts.name,
                id: showcaseProducts.sku,
                price: showcaseProducts.price_block.credit_card.value_with_discount.replace('R$', '').replace(/,/g, '.').replace(/^\s+|\s+$/g, ""),
                brand: showcaseProducts.brand,
                category: showcaseProducts.categories_name_path,
                variant: showcaseProducts.type_id,
                list: $(el).attr('page'),
                position: indice,
                vitrine: typeInfo
            }

            productsList.push(productObj)

            function showDigitalSeal(value) {
                return value ? "digital" : ""
            }

            function fixImageUrl(productInfo) {
                let valueSplitted = productInfo.image.split(".")
                if (valueSplitted[valueSplitted.length - 1] != "jpg" || productInfo.type_id != "grouped") {
                    return productInfo.image + "300&a=-1"
                } else {
                    return productInfo.image
                }
            }

            function doTruncarStr(str, size) {
                if (str == undefined || str == 'undefined' || str == '' || size == undefined || size == 'undefined' || size == '') {
                    return str;
                }
                var shortText = str;
                if (str.length >= size + 3) {
                    shortText = str.substring(0, size).concat('...');
                }
                return shortText;
            }

            function doTruncarStrClassicos(str, size){
                if (str==undefined || str=='undefined' || str =='' || size==undefined || size=='undefined' || size ==''){
                  return str;
                }
                var shortText = str;
                
                if(str.length >= size+3){
                    $(window).width() < 425 ? size = 50 : size
                    shortText = str.substring(0, size).replace(/\./g,'. ').concat('...');
                }
                return shortText
              }

            function validateSale(sale) {
                if (sale > 0) {
                    return '<span class="tagSale lazyAtivado show"> -' + sale + '% </span>';
                }
                return '';
            };

            function validAuthors(author) {
                author.length ? author : "..."
                return ''
            }

            function funcRating(rating) {
                if (rating > 0.0) {
                    return 'rating-box';
                } else {
                    return 'rating-box rating-box-desabled';
                }

            }

            function validPre(pre) {
                if (pre !== 0) {
                    return 'pré-venda'
                }
                return '';
            }


            function validPrace(por) {
                if (por.nominal === por.final) {
                    return '';
                } else {
                    return 'R$ ' + por.nominal;
                }
            }

            function validInstallmentePorce(porce) {
                if (porce.discount_percent != 0) {
                    return '(-' + porce.discount_percent + '%)';
                }
                return '';
            }

            function validInstallmente(parce1, parce2) {
                if (parce1.value_with_discount === parce2.nominal) {
                    return '';
                } else if (parce1.value_with_discount === parce2.value_installments_without_fee) {
                    return 'em até ' + parce1.qty_installments_with_discount + 'x no cartão de crédito';
                } else if (parce1.has_discount !== 0 && parce2.value_installments_without_fee == 0) {
                    return 'em até ' + parce1.qty_installments_with_discount + 'x no cartão de crédito';
                }
                return 'em ' + parce1.qty_installments_with_discount + 'x no cartão de crédito ou em até ' + parce2.qty_installments_without_fee + 'x de R$ ' + parce2.value_installments_without_fee + ' ';
            }

            function validSaraiva(sara) {
                if (sara.discount_percent == 0 && sara.total_value_installments_with_fee == '0,00') {
                    return ' em ' + sara.qty_installments_with_discount + 'x sem juros no Cartão Saraivas';
                } else if (sara.discount_percent == 0) {
                    return ' em ' + sara.qty_installments_without_fee + 'x sem juros no Cartão Saraiva b';
                }
                return ' R$ ' + sara.value_with_discount + '   <span class="vProduct-percentDiscount">(' + sara.discount_percent + '% de desconto)</span> no Cartão Saraiva';
            }

            function validateOnSale(onSale) {
                if (onSale && onSale.category) {
                    return '<img src="' + onSale.category.url + '" title=""> ';
                }
                return '';
            }

            function limitTitleShowcase(title) {
                if (title.length > 65) {
                    return title.substring(0, 62) + '...'
                } else {
                    return title
                }
            }

            function sobEncomenda(status) {
                return status ? status : false
            }

            function limitPrice(price) {
                console.log(price.length)
                if (price.length > 60) {
                    return price.substring(0, 57) + '...'
                } else {
                    return price
                }
            }

            var htmlShowCaseAspirational = '<div class="product__aspirational" data-pid="' + showcaseProducts.id + '" id="coleAspi__showcase-' + showcaseProducts.id + '" data-sku="' + showcaseProducts.sku + '" data-sob="' + sobEncomenda(showcaseProducts.back_order) + '" itemscope itemtype="http://schema.org/Product">' +
                '<div class="product__container">' +
                '<div class="container__img">' +
                '<img src="' + fixImageUrl(showcaseProducts) + '" class="lazy" alt="' + showcaseProducts.name + '">' +
                '</div>' +
                '</div>' +
                '<div class="container__info">' +
                '<div class="container__values">' +
                '<span class="container__special_price" itemprop="price">R$ ' + showcaseProducts.price_block.credit_card.value_with_discount + '</span>' +
                '</div>' +
                '</div>' +
                '<div class="container__name" itemprop="name">' +
                '<h2>' + limitTitleShowcase(showcaseProducts.name) + '</h2>' +
                '</div>' +
                '</div>';

            htmlShowcase = '<div class="product__comum" data-track="true" data-track-list="' + productObj.list + '"data-track-name="' + productObj.name + '" data-track-id="' + productObj.id + '" data-track-price="' + productObj.price + '" data-track-brand="' + productObj.brand + '"  data-track-category="' + productObj.category + '" data-track-variant="' + productObj.variant + '" data-track-position="' + productObj.position + '" data-track-vitrine="' + productObj.vitrine + '">' +
                '<div class="product__content">' +
                '<div class="content__left">' +
                '<figure>' +
                '<a href="' + showcaseProducts.url + '" data-track="click">' +
                '<div class="content__img ' + showDigitalSeal(showcaseProducts.digital) + '">' +
                '<img src="' + fixImageUrl(showcaseProducts) + '" title="' + showcaseProducts.name + '" />' +
                validateSale(showcaseProducts.price_block.price.discount_percent) +
                '</div>' +
                '</a>' +
                '</figure>' +
                '</div>' +
                '<div class="content__right">' +
                '<div class="content__text">' +
                '<a href="' + showcaseProducts.url + '" data-track="click">' +
                '<span class="title">' + doTruncarStr(showcaseProducts.name, 40) + '</span>' +
                '<span class="subtitle">' + validAuthors(showcaseProducts.authors) + '</span>' +
                '</a>' +
                '<div class="ratings">' +
                '<a href="' + showcaseProducts.url + '" title="' + showcaseProducts.name + '" data-track="click">' +
                '<div class="' + funcRating(showcaseProducts.reviews_stars_width) + '">' +
                '<div class="rating" style="width:' + showcaseProducts.reviews_stars_width + '%;"></div>' +
                '</div>' +
                '<span class="amount"></span>' +
                '</a>' +
                '</div>' +
                '<div class="bottom-block-price" data-pre="' + validPre(showcaseProducts.presale) + '">' +
                '<span class="preorder">' + validPre(showcaseProducts.presale) + '</span>' +
                '<span class="list_price_group">' +
                '<span class="price">' + validPrace(showcaseProducts.price_block.price) + '</span>' +
                '<span class="special_price">R$ ' + showcaseProducts.price_block.credit_card.value_with_discount + '</span>' +
                '<span class="discount_value">' + validInstallmentePorce(showcaseProducts.price_block.credit_card) + '</span>' +
                '<span class="discount_cc">' + validInstallmente(showcaseProducts.price_block.credit_card, showcaseProducts.price_block.price) + '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="content__saraiva-card">' +
                '<svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-cartao-saraiva"><svg id="icon-cartao-saraiva" viewBox="0 0 256 256" width="100%" height="100%"><title>Artboard 22</title><path d="M214.72 220.51a3.32 3.32 0 0 1 0-6.63 26.85 26.85 0 0 0 26.82-26.82 3.32 3.32 0 1 1 6.63 0 33.49 33.49 0 0 1-33.45 33.45zM41.73 220.51a33.49 33.49 0 0 1-33.45-33.44 3.32 3.32 0 1 1 6.63 0 26.84 26.84 0 0 0 26.82 26.82 3.32 3.32 0 0 1 0 6.63zM11.6 80.57a3.31 3.31 0 0 1-3.32-3.32 33.49 33.49 0 0 1 33.45-33.46 3.32 3.32 0 0 1 0 6.63 26.85 26.85 0 0 0-26.82 26.83 3.31 3.31 0 0 1-3.31 3.32zM244.85 80.57a3.31 3.31 0 0 1-3.32-3.32 26.86 26.86 0 0 0-26.82-26.83 3.32 3.32 0 0 1 0-6.63 33.49 33.49 0 0 1 33.46 33.46 3.31 3.31 0 0 1-3.32 3.32z"></path><path d="M244.85 190.38a3.31 3.31 0 0 1-3.32-3.32V77.25a3.32 3.32 0 1 1 6.63 0v109.82a3.31 3.31 0 0 1-3.31 3.31zM214.72 220.51h-173a3.32 3.32 0 0 1 0-6.63h173a3.32 3.32 0 0 1 0 6.63zM11.6 190.38a3.32 3.32 0 0 1-3.32-3.32V77.25a3.32 3.32 0 1 1 6.63 0v109.82a3.31 3.31 0 0 1-3.31 3.31zM214.72 50.42h-173a3.32 3.32 0 0 1 0-6.63h173a3.32 3.32 0 0 1 0 6.63z"></path><path d="M244.85 91.15H11.6a3.32 3.32 0 0 1 0-6.63h233.25a3.32 3.32 0 0 1 0 6.63zM244.85 118.56H11.6a3.32 3.32 0 0 1 0-6.63h233.25a3.32 3.32 0 0 1 0 6.63zM69.86 135.47H32.17a3.32 3.32 0 0 1 0-6.63h37.69a3.32 3.32 0 1 1 0 6.63z"></path><path fill="#1d1d1b" d="M215.82 136.85l-44.66 8.6 8.59 44 44.66-8.57-8.59-44.03z"></path><g clip-path="url(#a)"><path d="M126.34 155.61l6.34 33.45c15.63-11.2 30.12-13.19 37-8.05l-6.79-33.74c-4.52-4.42-20.67-4.93-36.57 8.34m-4.79-1.69c15.71-14.74 39.37-18.55 45.48-8l8.72 44.73c-8.23-10.21-24.2-11.26-45.91 6.23z" fill="#1d1d1b"></path></g></svg></use></svg>' +
                '<span class="saraiva-card__info"> ' + validSaraiva(showcaseProducts.price_block.saraiva_card) + '</span>' +
                '</div>' +
                '<div class="content__category">' + validateOnSale(showcaseProducts.on_sale) + '</div>' +
                '<div class="content__action">' +
                '<button type="button" title="Comprar" class="' + classBtnDefault + '" data-sku="' + showcaseProducts.sku + '" id="btn-cart">Adicionar ao Carrinho</button>' +
                '</div>' +
                '</div>' +
                '</li>';

            htmlShowcaseEstante =
                '<div class="product__estante" data-track="true" data-track-list="' + productObj.list + '"data-track-name="' + productObj.name + '" data-track-id="' + productObj.id + '" data-track-price="' + productObj.price + '" data-track-brand="' + productObj.brand + '"  data-track-category="' + productObj.category + '" data-track-variant="' + productObj.variant + '" data-track-position="' + productObj.position + '" data-track-vitrine="' + productObj.vitrine + '">' +
                '<a href="' + showcaseProducts.url + '" data-track="click">' +
                '<figure>' +
                '<div class="seal ' + showDigitalSeal(showcaseProducts.digital) + '"></div>' +
                '<img alt="' + showcaseProducts.name + '" src="' + fixImageUrl(showcaseProducts) + '">' +
                '<figcaption>' +
                '<div class="content__product">' +
                '<div class="price-group">' +
                '<div class="preorder">' + validPre(showcaseProducts.presale) + '</div>' +
                '<div class="price">' + validPrace(showcaseProducts.price_block.price) + '</div>' +
                '<div class="special-price">R$ ' + showcaseProducts.price_block.credit_card.value_with_discount + '</div>' +
                '<div class="discount-cc">' + validInstallmente(showcaseProducts.price_block.credit_card, showcaseProducts.price_block.price) +
                '</div>' +
                '</div>' +
                '</figcaption > ' +
                '</figure>' +
                '</a>' +
                '</div>';

            htmlShowcaseClassicos = 
            '<li class="destaques__box" data-track="true" data-track-list="'+ productObj.list +'"data-track-name="' + productObj.name + '" data-track-id="' + productObj.id +'" data-track-price="'+ productObj.price +'" data-track-brand="'+ productObj.brand +'"  data-track-category="'+ productObj.category +'" data-track-variant="'+ productObj.variant +'" data-track-position="'+ productObj.position +'" data-track-vitrine="'+ productObj.vitrine +'">' +
                '<a href="' + showcaseProducts.url +'" data-track="click">' +
                    '<div class="box__img-prod">' +
                        '<img src="' + showcaseProducts.image + '200&a=-1" title="'+ showcaseProducts.name +'" />' +
                    '</div>' +
                    '<div class="box__book">' +
                        '<div class="box__centralizado">' +
                            '<h3>' + doTruncarStrClassicos(showcaseProducts.name, 40) + '</h3>' +
                            '<small>' + (showcaseProducts.brand) + '</small>' +
                            '<p>' + doTruncarStrClassicos(showcaseProducts.description, 260) + '</p>' +
                            '<button class="cta">CONFIRA</button>' +
                        '</div>' +
                    '</div>' +
                '</a>' +    
            '</li>';    

            tipoVitrine == "comum" ? htmlShowcase : tipoVitrine == "aspiracional" ? htmlShowcase = htmlShowCaseAspirational : tipoVitrine == "classicos" ? htmlShowcase = htmlShowcaseClassicos : htmlShowcase = htmlShowcaseEstante

            $(el).append(htmlShowcase);
            var linkVitrine = $(el).data('vitrine').link
            tipoVitrine == "estante" ? index == lista.products.length - 1 ? $(el).append($('<div class="product__estante--cta-ver-todos"><a href="https://www.saraiva.com.br/' + linkVitrine + '">ver todos os produtos</a></div>')) : null : null

        });


        if (typeof dataLayer !== "undefined") {
            dataLayer.push({
                'event': 'productImpression',
                'ecommerce': {
                    'currencyCode': 'BRL',
                    'impressions': productsList
                }
            });
        }

    }

    function htmlModal(product, id, sob, element) {
        var warranty,
            insurance,
            classBtnDefault;

        warranty = product.warranty;
        insurance = product.insurance;

        if (warranty !== '' && warranty !== null && typeof warranty !== 'undefined' && insurance !== '' && insurance !== null && typeof insurance !== 'undefined') {
            classBtnDefault = 'add-cart check-services btn-secondary btn-full icon icon-carrinho icon-btn product-has-warranty product-has-insurance'
        } else {
            classBtnDefault = 'add-cart check-services btn-secondary btn-full icon icon-carrinho icon-btn';
        }

        function limitTitleModal(limitTitle) {
            var titleModal = limitTitle;
            if (titleModal.length > 99) {
                return titleModal.substring(0, 100) + '...';
            }
            return titleModal;
        }

        function funcRating(rating) {
            if (rating > 0.0) {
                return 'rating-box';
            } else {
                return 'rating-box rating-box-desabled';
            }
        }

        function limitText(params) {
            var des = params;
            if (des.length > 350) {
                return des.substring(0, 350) + '...';
            }
            return des;
        }

        function validPrace(por) {
            if (por.nominal === por.final) {
                return '';
            } else {
                return 'De: R$ ' + por.nominal;
            }
        }

        function limitTitleShowcase(limit) {
            var title = limit;
            if (title.length > 65) {
                return title.substring(0, 62) + '...';
            }
            return title;
        }

        function validInstallmente(parce1, parce2) {
            if (parce1.value_with_discount === parce2.nominal) {
                return '';
            }
            return 'Em ' + parce1.qty_installments_with_discount + 'x no cartão';
        }

        function validInstallmente2(parce1, parce2) {
            if (parce1.value_with_discount === parce2.nominal) {
                return '';
            } else if (parce1.has_discount !== 0) {
                return '<div class="discount_cc"><div class="cartao-total"><span>Parcelado:</span> R$ ' + parce2.total_value_installments_with_fee + ' </div> em atÃ© ' + parce2.qty_installments_without_fee + 'x de <span class="value-different">R$ ' + parce2.value_installments_with_fee + '</span> sem juros</div>';
            }
            return '';
        }

        function validSaraiva(sara) {
            var num = parseInt(sara.qty_installments_with_discount);
            if (num === sara.qty_installments_without_fee) {
                return 'Cartão Saraiva: <span class="value-different">' + sara.qty_installments_with_discount + 'x de R$ ' + sara.value_with_discount + '</span>';
            } else {
                return 'Cartão Saraiva: <span class="value-different">' + sara.qty_installments_with_discount + 'x de R$ ' + sara.value_with_discount + '</span> <span class="vProduct-percentDiscount">(-' + sara.discount_percent + '%)</span> ou em atÃ© ' + sara.qty_installments_without_fee + 'x de R$ ' + sara.value_installments_without_fee + ' sem juros';
            }
        }

        var htmlProduct = '<div class="modal__product">' +
            '<div class="fechar">' +
            '<div class="fechar-icon">' +
            '<svg width="21px" height="21px" fill="#818181">' +
            '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-fechar">' +
            '<symbol id="icon-fechar" viewBox="0 0 256 256">' +
            '<title>Artboard 41</title>' +
            '<path d="M54.79 213.86a3 3 0 0 1-2.23-5l69.58-77.32a5.27 5.27 0 0 0 0-7.07L52.56 47.15a3 3 0 0 1 4.46-4l69.58 77.32a11.26 11.26 0 0 1 0 15.1L57 212.87a3 3 0 0 1-2.21.99z" fill="#14171c"></path><path d="M201.21 213.86a3 3 0 0 1-2.23-1l-69.58-77.31a11.26 11.26 0 0 1 0-15.1L199 43.13a3 3 0 0 1 4.46 4l-69.58 77.32a5.27 5.27 0 0 0 0 7.07l69.59 77.32a3 3 0 0 1-2.23 5z" fill="#14171c"></path>' +
            '</symbol>' +
            '</use>' +
            '</svg>' +
            '</div>' +
            '</div>' +
            '<div class="left__content">' +
            '<div class="title">' +
            '<h2>' + limitTitleModal(product.name) + '</h2>' +
            '</div>' +
            '<div class="rating">' +
            '<div class="' + funcRating(product.reviews_stars_width) + '">' +
            '<div class="rating" style="width:' + product.reviews_stars_width + '%;"></div>' +
            '</div>' +
            '</div>' +
            '<div class="image">' +
            '<div class="content__image">' +
            '<img src="https://images.livrariasaraiva.com.br/imagemnet/imagem.aspx/?pro_id=' + id + '&qld=90&l=430&a=-1">' +
            '</div>' +
            '</div>' +
            '<div class="description">' +
            limitText(product.description) +
            '</div>' +
            '</div>' +
            '<div class="right__content">' +
            '<div class="encomenda" data-status="' + sob + '">' +
            'Produto sob encomenda' +
            '</div>' +
            '<div class="price--before">' +
            '<span class="price">' + validPrace(product.price_block.price) + '</span>' +
            '</div>' +
            '<div class="price--after">' +
            '<span>Por:</span> R$ ' + product.price_block.credit_card.value_with_discount + '' +
            '<div class="price__parcelas">' +
            '<span class="desconto">' + validInstallmente(product.price_block.credit_card, product.price_block.price) + '</span>' +
            '</div>' +
            '</div>' +
            '<div class="cartao">' +
            validInstallmente2(product.price_block.credit_card, product.price_block.price) +
            '</div>' +
            '<div class="cartao--saraiva">' +
            validSaraiva(product.price_block.saraiva_card) +
            '</div>' +
            '<div class="button">' +
            '<button type="button" title="Comprar" class="' + classBtnDefault + '" data-sku="' + id + '" id="btn-cart"></button>' +
            '</div>' +
            '</div>' +
            '<div class="footer__content">' +
            '<a href="/' + product.url + '">Ver tudo sobre o produto</a>' +
            '<div class="footer__icon"></div>'
        '</div>'
        '</div>';
        $(element).closest('[data-vitrine]').find('.modal').append(htmlProduct);
    }

    function loadProduct(id, sob, element) {
        var sku = id;
        var sob = sob;
        $.ajax({
            url: 'https://api.saraiva.com.br/sc/produto/pdp/' + sku + '/0/0/1/',
            dataType: 'json',
            beforeSend: function () {
                $('[data-vitrine] .modal').append('<img class="load-ajaxing" style="display:block;margin:100px auto 70px;" src="http://www.saraiva.com.br/skin/frontend/saraiva/saraiva/images/opc-ajax-loader.gif" alt="">');
            },
            success: function (data) {
                htmlModal(data, id, sob, element);
            },
            complete: function (resposta) {
                $('[data-vitrine] .modal .load-ajaxing').remove();
            }
        });
    }

    function openModal(element) {
        var sku = $(element).data('sku');
        var sob = $(element).data('sob');
        var vitrine = $(element).closest('[data-vitrine]')
        loadProduct(sku, sob, element)
        $("<div class='modal'></div>").hide().appendTo($(vitrine)).fadeIn('fast')
        $("<div class='overlay'></div>").hide().appendTo($(vitrine)).fadeIn('slow')


        if (width <= 768) {
            $('body').addClass('no-scroll');
        }
    }

    function closeModal() {
        $('[data-vitrine] .modal, [data-vitrine] .overlay').fadeOut('slow', function () {
            $(this).remove()
        })
        if (width <= 768) {
            $('body').removeClass('no-scroll');
        }
    }

    function addToCardOnClick(e, element) {
        e.preventDefault();
        var idSku = $(element).data('sku');
        cartCatalog.addToCart(idSku, 1);
    }

    function addToCartOnModal(e) {
        e.preventDefault();
        var idSku = $(e.currentTarget).data('sku');
        cartCatalog.addToCart(idSku, 1);

        dataLayer.push({
            'event': 'addToCart',
            'ecommerce': {
                'currencyCode': 'BRL',
                'add': {
                    'products': [{
                        'name': $(e.currentTarget).parents('li').attr('data-track-name'),
                        'id': Number($(e.currentTarget).parents('li').attr('data-track-id')),
                        'price': Number($(e.currentTarget).parents('li').attr('data-track-price')),
                        'brand': $(e.currentTarget).parents('li').attr('data-track-brand'),
                        'category': $(e.currentTarget).parents('li').attr('data-track-category'),
                        'variant': $(e.currentTarget).parents('li').attr('data-track-variant'),
                        'list': $(e.currentTarget).parents('li').attr('data-track-list'),
                        'position': $(e.currentTarget).parents('li').attr('data-track-position'),
                        'quantity': 1,
                        'vitrine': $(e.currentTarget).parents('li').attr('data-track-vitrine')
                    }]
                }
            }
        });
    }

    function dataTrack(element) {
        dataLayer.push({
            'event': 'productClick',
            'ecommerce': {
                'click': {
                    'actionField': {
                        'list': $(element).data('track-list')
                    },
                    'products': [{
                        'name': $(element).data('track-name'),
                        'id': Number($(element).data('track-id')),
                        'price': Number($(element).data('track-price')),
                        'brand': $(element).data('track-brand'),
                        'category': $(element).data('track-category'),
                        'variant': $(element).data('track-variant'),
                        'position': $(element).data('track-position'),
                        'vitrine': $(element).data('track-vitrine')
                    }]
                }
            },
            'eventCallback': function () {
                document.location = productObj.url
            }
        });
    }


    function slickLoadAjax(thisSlider, id_vitrine) {
        var data = $(thisSlider).data("vitrine"),
            responsivo = $(thisSlider).data("responsivo"),
            slickOptions = $(thisSlider).data("slick-options"),
            slicked = $(thisSlider).hasClass("slick-initialized");

        // carregar id respectivo passado como parâmetro
        !id_vitrine ? id_vitrine = data.id_vitrine : id_vitrine

        //instruções default
        var responsiveOptionsDefault = [{ breakpoint: 1439, settings: { slidesToShow: 4 } }, { breakpoint: 1023, settings: { slidesToShow: 3 } }, { breakpoint: 767, settings: { slidesToShow: 2 } }, { breakpoint: 424, settings: { slidesToShow: 1 } }],
            slickOptionsDefault = { mobileFirst: true, infinite: false, dots: true, responsive: responsivo ? responsivo : responsiveOptionsDefault },
            mobileScreen = $(window).width() <= 768,
            slickOptionsEstante = { dots: true, infinite: true, speed: 300, slidesToShow: 1, centerMode: true, variableWidth: true }


        // Se não possuir slick options e não possuir slick options responsiva carregar instruções default
        slickOptions.mobileFirst == false ? slickOptions.mobileFirst : slickOptions.mobileFirst = true
        !slickOptions ? slickOptions = slickOptionsDefault : !responsivo ? slickOptions.responsive = responsiveOptionsDefault : responsivo == "nulo" ? delete slickOptions.responsive : slickOptions.responsive = responsivo

        data.tipo == "estante" ? delete slickOptions.responsive : slickOptions
        // Carregar 5 itens apenas no mobile
        mobileScreen ? data.produtos_quantidade = 5 : data.produtos_quantidade = data.produtos_quantidade


        function callAjax() {
            $.ajax({
                url: 'https://api.saraiva.com.br/collection/products/' + id_vitrine + '/0/0/1?l=' + data.produtos_quantidade,
                type: 'GET'
            }).done(function (data) {
                slickOptions.variableWidth ? slickOptions.slidesToShow = data.total_count - 1 : slickOptions.slidesToShow
                vitrineLoader(data, thisSlider)
                $(thisSlider).fadeIn('fast', function () {
                }).slick(slickOptions).addClass('active')
            })
        }
        if (slicked) {
            $(thisSlider).fadeOut('fast', function () {
                $(this).slick('unslick').children().remove().promise().done(function () {
                    callAjax()
                })
            })
        } else {
            callAjax()
        }
    }

    function loadSlicks() {
        var vitrines = $('[data-vitrine]')
        vitrines.each(function (index) {
            var $this = $(this)
            $(this).addClass($(this).data("vitrine").tipo)
            slickLoadAjax($this)
        })
    }


    $(document).ready(function () {

        $('[data-vitrine]').on('click', '.product__aspirational', function (e) {
            e.preventDefault()
            openModal(e.currentTarget)
        })

        $('[data-vitrine]').click(function (e) {
            if (e.target == $('.overlay')[0] || e.target == $(e.target).closest('.fechar').find('svg')[0]) {
                closeModal()
            }
        })

        $('[data-vitrine]').on('click', '#btn-cart', function (e) {
            if ($(e.currentTarget).closest('[data-vitrine] .modal .button')) {
                addToCartOnModal(e)
            } else if ($(e.currentTarget).closest('.content__action')) {
                addToCardOnClick(e, e.currentTarget)
            }
        });

        $('[data-vitrine]').on('click', '[data-track="true"]', function (e) {
            dataTrack(e.currentTarget)
        });

        $('[data-menu-vitrine] li').click(function (e) {
            e.preventDefault()
            var $this = $(this)
            var thisUrl = $(this).children().attr('href')
            !$this.hasClass('active') ? slickLoadAjax($this.closest('.row').find('[data-vitrine]'), $this.data('id-vitrine')) : ''
            $this.addClass('active').siblings().removeClass('active')
            $this.closest('.row').find('[data-button-vitrine]').children('a').attr('href', thisUrl)
        })

        function checkForChanges() {
            if ($('[data-vitrine] .product__estante').length) {
                $('[data-vitrine].estante figcaption').each(function () {
                    var $this = $(this)
                    str = $this.find('.discount-cc').text()
                    var textSub = str.substring(0, 26);
                    console.log($this.height())
                    $this.height() > 73 ? $this.find('.discount-cc').text(textSub + '...') : $this.find('.discount-cc').text(str)
                })
            } else {
                setTimeout(checkForChanges, 300);
            }
        }

        loadSlicks()
        checkForChanges()
        width = $(window).width()

    })

