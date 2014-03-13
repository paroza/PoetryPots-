# mongoengine database module
from mongoengine import *
import logging

class Tweets(Document):
	tweetID = StringField()
	text = StringField()
	username = StringField()
	