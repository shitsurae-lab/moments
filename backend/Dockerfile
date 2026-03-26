# PHP 8.3 の FPM イメージを使用
FROM php:8.3-fpm

# 作業ディレクトリの設定
WORKDIR /var/www

# 必要なシステムパッケージのインストールとPHP拡張のセットアップ
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl \
    libzip-dev \
    libonig-dev

# PHP拡張のインストール (画像処理 gd, データベース pdo_mysql など)
RUN docker-php-ext-install pdo_mysql mbstring zip exif pcntl
RUN docker-php-ext-configure gd --with-freetype --with-jpeg
RUN docker-php-ext-install gd

# Composer のインストール (公式イメージからコピー)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 権限の設定 (Laravelが書き込めるように)
RUN chown -R www-data:www-data /var/www

# ポートの露出
EXPOSE 9000

CMD ["php-fpm"]
