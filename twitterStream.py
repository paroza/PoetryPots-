from tweepy import Stream
from tweepy import OAuthHandler
from tweepy.streaming import StreamListener

import os
import time
import requests
import pprint
import json

import mongoengine
import models

# --------- Database Connection ---------
# MongoDB connection to MongoLab's database
mongoengine.connect('mydata', host=myUrl)
#app.logger.debug("Connecting to MongoLabs")

class listener (StreamListener):
	def on_status(self, status):
		tweetID = str(status.id)
		text = status.text
		# tweet = (tweetID, text, user)
		newTweet = models.Tweets(tweetID=str(status.id), text=status.text)
		newTweet.save()

		print str(status.id), status.text
		return True

	def on_error (self, status):
		print status

auth = OAuthHandler(ckey, csecret)
auth.set_access_token(atoken, asecret)
twitterStream = Stream(auth, listener())
twitterStream.filter(track=["poetrypots"])