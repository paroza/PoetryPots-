import os
import time
import requests

import pprint
import json
import sys
from urllib import urlencode
from twitterStream.py import *
from models import *
import mongoengine
from mongoengine import *

from flask import Flask, request, redirect, jsonify # Retrieve Flask, our framework
from flask import render_template

app = Flask(__name__)   # create our flask app

# --------- Database Connection ---------
# MongoDB connection to MongoLab's database
mongoengine.connect('mydata', host=myUrl)
#app.logger.debug("Connecting to MongoLabs")

@app.route("/",methods=['GET','POST'])
def display_tweets():
    return render_template("garden.html")

@app.route("/gettweets",methods=['GET'])
def get_tweets():

    # get tweet ID of the last tweet to be displayed, search database for new tweets
    # and return tweets back to .js via ajax
    newSinceID = request.args.get('sinceID')
    recentTweets = Tweets.objects(tweetID__gt=newSinceID).order_by('tweetID')
    
    tweetsJsonList = []
    tweetJson = "["
    count = 0
    length = len(recentTweets)
    for t in recentTweets:
        strippedText = t.text.replace('\"', '');
        strippedText = strippedText.replace('\'', '');
        tweetJson += '{ "id" : "' + t.tweetID +'", "text" : "' + strippedText +'"}'
        count = count + 1
        if (count < length):
            tweetJson += ","
        tweetsJsonList.append(tweetJson)
    print tweetsJsonList
    tweetJson += "]"
    
    theString = ''.join(tweetsJsonList)
 
    return tweetJson


@app.template_filter('strftime')
def _jinja2_filter_datetime(date, fmt=None):
    pyDate = time.strptime('2011-12-23T20:34:47.000Z','%Y-%m-%dT%H:%M:%S.000Z') # convert twitter date string into python date/time
    return time.strftime('%Y-%m-%d %H:%M:%S', pyDate) # return the formatted date.

# --------- Server On ----------
# start the webserver
if __name__ == "__main__":
        app.debug = True
        
        port = int(os.environ.get('PORT', 5003)) # locally PORT 5000, Heroku will assign its own port
        app.run(host='127.0.0.1', port=port)