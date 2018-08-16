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
            classBtnDefault = classBtnDefault + ' product-has-warranty';
        } else if (insurance === 'sim' && warranty === 'não') {
            classBtnDefault = classBtnDefault + ' product-has-insurance';
        } else if (warranty === 'sim' && insurance === 'sim') {
            classBtnDefault = classBtnDefault + ' product-has-warranty product-has-insurance';
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
            let conditions = productInfo.type_id == "grouped" && valueSplitted[valueSplitted.length - 1] == "png" || valueSplitted[valueSplitted.length - 1] == "jpg" || valueSplitted[valueSplitted.length - 1] == "jpeg"
            return conditions ? productInfo.image : productInfo.image + "300&a=-1"
        }

        function doTruncarStr(str, size) {
            conditions = str == undefined || str == 'undefined' || str == '' || size == undefined || size == 'undefined' || size == ''
            !conditions ? $(window).width() < 425 ? size = 50 : size : ''
            return str.length > size + 3 ? str.substring(0, size).replace(/\./g, '. ').concat('...') : str
        }

        function validateSale(sale) {
            return sale > 0 ? '<span class="tagSale lazyAtivado show"> -' + sale + '% </span>' : ''
        }

        function validAuthors(authors, data) {
            return (authors.length) ? authors.map((author, index) => `${author.name}<br />`).join('') : ""
        }

        function funcRating(rating) {

            return rating > 0.0 ? `
            <div class="ratings">
                <a href="${showcaseProducts.url}" title="${showcaseProducts.name}" data-track="click">
                    <div class="rating-box">
                        <div class="rating" style="width: ${showcaseProducts.reviews_stars_width}%;"></div>
                    </div>
                </a>
            </div>` : `
            <div class="ratings"></div>
            `
        }

        function validPre(pre) {
            return pre !== 0 ? 'pré-venda' : '';
        }

        function validPrace(por) {
            return por.nominal === por.final ? '' : 'R$ ' + por.nominal;
        }

        function validacaoParcelamentoPorce(porce) {
            return porce.discount_percent != 0 ? '(-' + porce.discount_percent + '%)' : ''
        }

        function validacaoParcelamento(parce1, parce2) {
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
            return (onSale.length && onSale[0].category) ? `<div class="content__category"><img src="${onSale[0].category.url}" title="${onSale[0].category.text}"></div>` : `<div class="content__category"></div>`
        }

        function limitTitleShowcase(title, size) {
            return title.length > size ? `${title.substring(0, size + 3)}...` : title
        }

        function sobEncomenda(status) {
            return status ? status : false
        }

        (function (data) {
            const apiUrl = 'https://api.saraiva.com.br/';
            $.ajax({
                url: `${apiUrl}produto/urgencycards/${data.sku}=${data.rule_urgency}`,
                dataType: 'json',
                async: true,
                success: function (response) {
                    const urgencyRule = response[data.sku]
                    if (urgencyRule) {
                        urgencyOptions = {
                            remainingTime: urgencyRule.missing_time,
                            remainingItems: urgencyRule.remaining_quantity,
                            description: urgencyRule.description,
                            showTimer: urgencyRule.show_timer,
                            showItems: urgencyRule.show_counter,
                            toggle: false
                        }
                        function urgencyCounter(options) {
                            // options details
                            const remainingTime = options.remainingTime;
                            const remainingItems = options.remainingItems;
                            const description = options.description;
                            const showTimer = options.showTimer;
                            const showItems = options.showItems;
                            const toggle = options.toggle;

                            // svg defaults 
                            const svgns = "http://www.w3.org/2000/svg";
                            const xlinkns = "http://www.w3.org/1999/xlink";

                            // create html
                            const urgency = document.createElement('div');
                            const urgencyLead = document.createElement('span');
                            const urgencyIcon = document.createElement('i');
                            const urgencyRemainingTime = document.createElement('span');
                            const urgencyRemainingItems = document.createElement('span');
                            const urgencyDescription = document.createElement('p');

                            // add classes
                            urgency.classList.add('urgency');

                            // create icon clock
                            urgencyIcon.classList.add('icon', 'icon-clock');
                            urgencyIcon.setAttributeNS(xlinkns, 'href', '#icon-clock');


                            // add classes
                            urgencyRemainingTime.classList.add('urgency__remaining-time', 'active');
                            urgencyRemainingItems.classList.add('urgency__remaining-items');

                            // toggle remain and timer
                            if (toggle) {
                                urgency.classList.add('urgency--small');

                                if (showTimer && showItems) {
                                    urgencyRemainingItems.classList.add('hide');

                                    const toggleContent = setInterval(function () {
                                        urgencyLead.classList.toggle('hide');
                                        urgencyIcon.classList.toggle('hide');
                                        urgencyRemainingTime.classList.toggle('hide');
                                        urgencyRemainingItems.classList.toggle('hide');
                                    }, 3000);
                                }
                            }

                            // create counter
                            if (showTimer) {
                                urgencyLead.textContent = 'Oferta';
                                urgencyRemainingTime.textContent = '00:00:00';

                                let changeTime = remainingTime;
                                const createCounter = setInterval(function () {
                                    let seconds = changeTime;

                                    if (seconds > 59) {
                                        seconds = seconds % 60;
                                    }
                                    if (seconds < 10) {
                                        seconds = '0' + seconds;
                                    }

                                    let minutes = changeTime / 60;
                                    minutes = minutes % 60;
                                    minutes = Math.floor(minutes);

                                    if (minutes < 10) {
                                        minutes = '0' + minutes;
                                    }

                                    let hours = (changeTime / 60) / 60;
                                    hours = Math.floor(hours);

                                    if (hours < 10) {
                                        hours = '0' + hours;
                                    }

                                    urgencyRemainingTime.textContent = hours + ':' + minutes + ':' + seconds;

                                    changeTime--;
                                    if (changeTime < 0) {
                                        clearInterval(createCounter);

                                        urgency.classList.add('urgency-timeout');

                                        urgencyRemainingItems.textContent = 'Restam 0';

                                        if (toggle) {
                                            clearInterval(toggleContent);

                                            urgencyLead.classList.remove('hide');
                                            urgencyIcon.classList.remove('hide');
                                            urgencyRemainingTime.classList.remove('hide');
                                            urgencyRemainingItems.classList.add('hide');
                                        }
                                    }
                                }, 1000);
                            }
                            else {
                                urgency.classList.add('urgency--center');

                                urgencyLead.classList.add('hide');
                                urgencyIcon.classList.add('hide');
                                urgencyRemainingTime.classList.add('hide');
                            }

                            if (showItems) {
                                let remainText;
                                if (remainingItems > 1) {
                                    remainText = 'Restam '
                                }
                                else {
                                    remainText = 'Resta '
                                }

                                urgencyRemainingItems.textContent = remainText + remainingItems;
                            }
                            else {
                                urgency.classList.add('urgency--center');

                                urgencyRemainingItems.classList.add('hide');
                            }

                            // join html
                            urgency.appendChild(urgencyLead);
                            urgency.appendChild(urgencyIcon);
                            urgency.appendChild(urgencyRemainingTime);
                            urgency.appendChild(urgencyRemainingItems);

                            const urgencyWrap = document.createElement('div');
                            urgencyWrap.classList.add('urgency__wrap');

                            if (description && !toggle) {
                                urgencyDescription.classList.add('urgency__helper');
                                urgencyDescription.textContent = description;

                                urgencyWrap.appendChild(urgencyDescription);
                            }
                            urgencyWrap.appendChild(urgency)
                            return urgencyWrap
                        }
                        var retorno = urgencyCounter(urgencyOptions)
                        $(`.product__comum[data-sku="${data.sku}"]`).prepend(retorno)

                        setInterval(toggleClassTime, 3000, 200);
                    }
                }
            });
        })(this);


        function toggleClassTime(time) {

            if ($('.urgency__remaining-time').hasClass('active')) {
                $('.urgency__remaining-time').slideUp(time, function () {
                    $(this).removeClass('active')
                    $('.urgency__remaining-items').slideDown(time).addClass('active')
                })
            } else {
                $('.urgency__remaining-items').slideUp(time, function () {
                    $(this).removeClass('active')
                    $('.urgency__remaining-time').slideDown(time).addClass('active')
                })
            }

        }



        htmlShowCaseAspirational = '<div class="product__aspirational" data-pid="' + showcaseProducts.id + '" id="coleAspi__showcase-' + showcaseProducts.id + '" data-sku="' + showcaseProducts.sku + '" data-sob="' + sobEncomenda(showcaseProducts.back_order) + '" itemscope itemtype="http://schema.org/Product">' +
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
            '<h2>' + limitTitleShowcase(showcaseProducts.name, 65) + '</h2>' +
            '</div>' +
            '</div>';

        htmlShowcase = '<div class="product__comum" data-sku="' + showcaseProducts.sku + '" + data-track="true" data-track-list="' + productObj.list + '"data-track-name="' + productObj.name + '" data-track-id="' + productObj.id + '" data-track-price="' + productObj.price + '" data-track-brand="' + productObj.brand + '"  data-track-category="' + productObj.category + '" data-track-variant="' + productObj.variant + '" data-track-position="' + productObj.position + '" data-track-vitrine="' + productObj.vitrine + '">' +
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
            '<span class="subtitle">' + validAuthors(showcaseProducts.authors, showcaseProducts) + '</span>' +
            '</a>' +
            funcRating(showcaseProducts.reviews_stars_width) +
            '<div class="bottom-block-price" data-pre="' + validPre(showcaseProducts.presale) + '">' +
            '<span class="preorder">' + validPre(showcaseProducts.presale) + '</span>' +
            '<span class="list_price_group">' +
            '<span class="price">' + validPrace(showcaseProducts.price_block.price) + '</span>' +
            '<span class="special_price">R$ ' + showcaseProducts.price_block.credit_card.value_with_discount + '</span>' +
            '<span class="discount_value">' + validacaoParcelamentoPorce(showcaseProducts.price_block.credit_card) + '</span>' +
            '<span class="discount_cc">' + validacaoParcelamento(showcaseProducts.price_block.credit_card, showcaseProducts.price_block.price) + '</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            validateOnSale(showcaseProducts.on_sale) +
            '<div class="content__saraiva-card">' +
            '<i></i>' +
            '<span class="saraiva-card__info">' + validSaraiva(showcaseProducts.price_block.saraiva_card) + '</span>' +
            '</div>' +
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
            '<div class="figcaption">' +
            '<div class="content__product">' +
            '<div class="price-group">' +
            '<div class="preorder">' + validPre(showcaseProducts.presale) + '</div>' +
            '<div class="price">' + validPrace(showcaseProducts.price_block.price) + '</div>' +
            '<div class="special-price">R$ ' + showcaseProducts.price_block.credit_card.value_with_discount + '</div>' +
            '<div class="discount-cc">' + validacaoParcelamento(showcaseProducts.price_block.credit_card, showcaseProducts.price_block.price) +
            '</div>' +
            '</div>' +
            '</div>' +
            '</figure>' +
            '</a>' +
            '</div>';

        htmlShowcaseClassicos =
            '<li class="destaques__box" data-track="true" data-track-list="' + productObj.list + '"data-track-name="' + productObj.name + '" data-track-id="' + productObj.id + '" data-track-price="' + productObj.price + '" data-track-brand="' + productObj.brand + '"  data-track-category="' + productObj.category + '" data-track-variant="' + productObj.variant + '" data-track-position="' + productObj.position + '" data-track-vitrine="' + productObj.vitrine + '">' +
            '<a href="' + showcaseProducts.url + '" data-track="click">' +
            '<div class="box__img-prod">' +
            '<img src="' + fixImageUrl(showcaseProducts) + '" title="' + showcaseProducts.name + '" />' +
            '</div>' +
            '<div class="box__book">' +
            '<div class="box__centralizado">' +
            '<h3>' + doTruncarStr(showcaseProducts.name, 40) + '</h3>' +
            '<small>' + (showcaseProducts.brand) + '</small>' +
            '<p>' + doTruncarStr(showcaseProducts.description, 260) + '</p>' +
            '<button class="cta">CONFIRA</button>' +
            '</div>' +
            '</div>' +
            '</a>' +
            '</li>';

        htmlShowcaseEbooks =
            '<div class="product__ebooks" data-track="true" data-track-list="' + productObj.list + '"data-track-name="' + productObj.name + '" data-track-id="' + productObj.id + '" data-track-price="' + productObj.price + '" data-track-brand="' + productObj.brand + '"  data-track-category="' + productObj.category + '" data-track-variant="' + productObj.variant + '" data-track-position="' + productObj.position + '" data-track-vitrine="' + productObj.vitrine + '">' +
            '<a href="' + showcaseProducts.url + '" data-track="click">' +
            '<figure>' +
            '<div class="seal ' + showDigitalSeal(showcaseProducts.digital) + '"></div>' +
            '<img alt="' + showcaseProducts.name + '" src="' + fixImageUrl(showcaseProducts) + '">' +
            '</figure>' +
            '</a>' +
            '</div>';

        htmlShowcaseMural =
            '<div class="product__mural" data-track="true" data-track-list="' + productObj.list + '"data-track-name="' + productObj.name + '" data-track-id="' + productObj.id + '" data-track-price="' + productObj.price + '" data-track-brand="' + productObj.brand + '"  data-track-category="' + productObj.category + '" data-track-variant="' + productObj.variant + '" data-track-position="' + productObj.position + '" data-track-vitrine="' + productObj.vitrine + '">' +
            '<a href="' + showcaseProducts.url + '" data-track="click">' +
            '<figure style="margin: 0;">' +
            '<div class="seal ' + showDigitalSeal(showcaseProducts.digital) + '"></div>' +
            '<img alt="' + showcaseProducts.name + '" src="' + fixImageUrl(showcaseProducts) + '">' +
            '</figure>' +
            '</a>' +
            '</div>';

        tipoVitrine == "comum" ? htmlShowcase : tipoVitrine == "aspiracional" ? htmlShowcase = htmlShowCaseAspirational : tipoVitrine == "ebooks" ? htmlShowcase = htmlShowcaseEbooks : tipoVitrine == "mural" ? htmlShowcase = htmlShowcaseMural : tipoVitrine == "classicos" ? htmlShowcase = htmlShowcaseClassicos : htmlShowcase = htmlShowcaseEstante

        $(el).append(htmlShowcase)

        tipoVitrine == "estante" && $(window).width() >= 1024 && index == lista.products.length - 1 ? $(el).append($('<div class="product__estante product__estante--cta-ver-todos"><a href="https://www.saraiva.com.br/' + $(el).data('vitrine').link + '">ver todos os produtos</a></div>')) : null


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



    function funcRating(rating) {
        if (rating > 0.0) {
            return 'rating-box';
        } else {
            return 'rating-box rating-box-desabled';
        }
    }

    function limitarQtdCaracteres(params, size) {
        return params.length > size ? params.substring(0, size) + '...' : params
    }

    function validacaoPreco(por) {
        if (por.nominal === por.final) {
            return '';
        } else {
            return 'De: R$ ' + por.nominal;
        }
    }

    function validacaoParcelamento(parce1, parce2) {
        if (parce1.value_with_discount === parce2.nominal || parce1.has_discount === 0) {
            return '';
        } else if (parce1.has_discount !== 0) {
            return '<div class="discount_cc"><div class="cartao-total"><span>Parcelado:</span> R$ ' + parce2.total_value_installments_with_fee + ' </div> em atÃ© ' + parce2.qty_installments_without_fee + 'x de <span class="value-different">R$ ' + parce2.value_installments_with_fee + '</span> sem juros</div>';
        }
        return 'Em ' + parce1.qty_installments_with_discount + 'x no cartão';
    }



    function validSaraiva(sara) {

        var num = parseInt(sara.qty_installments_with_discount, 10);
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
        '<h2>' + limitarQtdCaracteres(product.name, 99) + '</h2>' +
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
        limitarQtdCaracteres(product.description, 350) +
        '</div>' +
        '</div>' +
        '<div class="right__content">' +
        '<div class="encomenda" data-status="' + sob + '">' +
        'Produto sob encomenda' +
        '</div>' +
        '<div class="price--before">' +
        '<span class="price">' + validacaoPreco(product.price_block.price) + '</span>' +
        '</div>' +
        '<div class="price--after">' +
        '<span>Por:</span> R$ ' + product.price_block.credit_card.value_with_discount + '' +
        '<div class="price__parcelas">' +
        '<span class="desconto">' + validacaoParcelamento(product.price_block.credit_card, product.price_block.price) + '</span>' +
        '</div>' +
        '</div>' +
        '<div class="cartao">' +
        validacaoParcelamento(product.price_block.credit_card, product.price_block.price) +
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
        slickOptionsEstante = {
            mobileFirst: true,
            centerMode: false,
            dots: true,
            arrows: false,
            infinite: false,
            slidesToShow: 2,
            slidesToScroll: 4,
            variableWidth: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        arrows: true,
                        dots: false,
                    }
                }
            ]
        }

    // Se não possuir slick options e não possuir slick options responsiva carregar instruções default
    slickOptions.mobileFirst == false ? slickOptions.mobileFirst : slickOptions.mobileFirst = true
    !slickOptions ? slickOptions = slickOptionsDefault : !responsivo ? slickOptions.responsive = responsiveOptionsDefault : responsivo == "nulo" ? delete slickOptions.responsive : slickOptions.responsive = responsivo


    // Carregar 5 itens apenas no mobile
    mobileScreen && data.tipo != "classicos" ? data.produtos_quantidade = 5 : data.produtos_quantidade = data.produtos_quantidade


    function callAjax() {
        $.ajax({
            url: 'https://api.saraiva.com.br/collection/products/' + id_vitrine + '/0/0/1?l=' + data.produtos_quantidade,
            type: 'GET'
        }).done(function (data) {
            function formattedEstanteView(dataSlickOptions, data) {
                // var total
                // $(window).width() <= 1024 ?  total = 5 : total = data.total_count + 1 
                // return(dataSlickOptions.slidesToScroll = total , dataSlickOptions.slidesToShow = total)
            }
            thisSlider.data('vitrine').tipo == "estante" ? formattedEstanteView(slickOptions, data) : null
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
                var textSub = str.substring(0, 26)
                $this.outerHeight() > 93 ? $this.find('.discount-cc').text(textSub + '...') : $this.find('.discount-cc').text(str)
            })
        } else {
            setTimeout(checkForChanges, 300);
        }
    }

    loadSlicks()
    checkForChanges()
    width = $(window).width()

})

