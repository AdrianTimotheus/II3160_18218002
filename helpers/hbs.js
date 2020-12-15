const moment = require('moment')
const express = require('express')
const mongoDB = require('mongodb')

const Quotes = require('../models/Quotes')

module.exports = {
    formatDate: function (date, format) {
        return moment(date).format(format)
    },

    editIcon: function (quotesUser, loggedUser, quotesId, floating = true) {
        if (quotesUser._id.toString() == loggedUser._id.toString()) {
          if (floating) {
            return `<a href="/stories/edit/${quotesId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
          } else {
            return `<a href="/stories/edit/${quotesId}"><i class="fas fa-edit"></i></a>`
          }
        } else {
          return ''
        }
    }
}