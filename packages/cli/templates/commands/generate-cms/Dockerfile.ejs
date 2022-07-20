FROM php:7.4-apache

# Enable apache rewrite
RUN a2enmod rewrite

RUN apt-get update && apt-get install -y \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libmcrypt-dev \
        libpng-dev

RUN docker-php-ext-configure gd \
--with-freetype \
--with-jpeg

# Install necessary php tools
RUN docker-php-ext-install pdo pdo_mysql mysqli gd

# Install xdebug
RUN pecl install xdebug && docker-php-ext-enable xdebug