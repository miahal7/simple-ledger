FROM phusion/passenger-customizable

# phusion/passenger - Set correct environment variables.
ENV HOME /root

# phusion/passenger - Use baseimage-docker's init process.
CMD ["/sbin/my_init"]


#   Python support.
RUN /pd_build/python.sh
#   Node.js and Meteor standalone support.
RUN /pd_build/nodejs.sh

ENV NODE_ENV production
ENV PASSENGER_APP_ENV production

WORKDIR /home/app

RUN apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /home/app/tmp/pids/* \
    && rm -f /etc/service/nginx/down \
    && rm -f /etc/nginx/sites-enabled/default

# ADD bundled meteor app to /home/app
ADD ./bundle/ .

RUN cd programs/server \
    && npm install \
    && mkdir public \
    && chown -Rh app:app /home
