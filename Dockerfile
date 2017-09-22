FROM phusion/passenger-customizable

# phusion/passenger - Set correct environment variables.
ENV HOME /root
#
# phusion/passenger - Use baseimage-docker's init process.
CMD ["/sbin/my_init"]


#   Python support.
RUN /pd_build/python.sh
#   Node.js and Meteor standalone support.
#   (not needed if you already have the above Ruby support)
RUN /pd_build/nodejs.sh

# Set user
# ENV APP_USER simple-ledger

# ENV METEOR_VERSION 1.5.2

# Set mongo url
# USER app
# ENV MONGO_URL mongodb://db:27017/meteor
# USER root
# RUN /pd_build/nodejs.sh

ENV NODE_ENV production
ENV PASSENGER_APP_ENV production

# ...put your own build instructions here...

# Clean up APT when done.
# RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Update locale settings for MongoDB
# RUN apt-get update -qq \
# && apt-get install -y locales -qq \
# && locale-gen en_US.UTF-8 en_us \
# && dpkg-reconfigure locales && \
# locale-gen C.UTF-8 && \
# /usr/sbin/update-locale LANG=C.UTF-8 \
# && apt-get clean
#
# # Set locale env vars
# ENV LANG C.UTF-8
# ENV LANGUAGE C.UTF-8
# ENV LC_ALL C.UTF-8

# Required by meteor for a non-root user to be able to write to /usr/local
# RUN useradd -ms /bin/bash ${APP_USER} \
#     && chown -Rh ${APP_USER} /usr/local

RUN rm -f /etc/service/nginx/down
RUN rm /etc/nginx/sites-enabled/default
ADD /nginx/app-server.conf /etc/nginx/sites-enabled/app-server.conf

# Switch user
# USER ${APP_USER}

# Install Meteor
# RUN curl https://install.meteor.com/?release=${METEOR_VERSION} | sh \
#     && mkdir /home/${APP_USER}/app/

# Change working directory to /home/user
# WORKDIR /home/${APP_USER}
# RUN chown -Rh ${APP_USER} /usr/local
WORKDIR /home/app


# Add the package.json file to WORKDIR and install packages now for quicker docker run startup
# COPY package.json package.json

# Install npm packages
# RUN npm install \
#     && npm cache clean \
#     && ln -sf /home/${APP_USER}/node_modules /home/${APP_USER}/app/node_modules

# WORKDIR /home/app

RUN apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /home/app/tmp/pids/*

RUN rm -f /etc/service/nginx/down
RUN rm -f /etc/nginx/sites-enabled/default

ADD /nginx/app-server.conf /etc/nginx/sites-enabled/app-server.conf
ADD ./bundle/ .

RUN cd programs/server \
    && npm install

RUN mkdir public
RUN chown -Rh app:app /home
