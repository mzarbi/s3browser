# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

# Flask modules
from flask import render_template, request
from jinja2 import TemplateNotFound

# App modules
from apps import app


# App main route + generic routing
@app.route('/', defaults={'path': 'index.html'})
@app.route('/<path>')
def index(path):
    try:
        # Detect the current page
        segment = get_segment(request)

        # Serve the file (if exists) from app/templates/home/FILE.html
        return render_template('home/' + path, segment=segment)

    except TemplateNotFound:
        return render_template('home/page-404.html'), 404


def get_segment(request):
    try:
        segment = request.path.split('/')[-1]
        if segment == '':
            segment = 'index'
        return segment
    except:
        return None


@app.route('/projects')
def projects():
    return render_template('home/projects.html', projects=[
        {
            "name": "Core",
            "description": "General CIB Operations",
            "usage": "45387 / 2.7 TiB"
        },
        {
            "name": "GB",
            "description": "General CIB Operations",
            "usage": "45387 / 2.7 TiB"
        },
        {
            "name": "ATLAS",
            "description": "General CIB Operations",
            "usage": "45387 / 2.7 TiB"
        },
        {
            "name": "Core",
            "description": "General CIB Operations",
            "usage": "45387 / 2.7 TiB"
        },
        {
            "name": "Core",
            "description": "General CIB Operations",
            "usage": "45387 / 2.7 TiB"
        },
        {
            "name": "Core",
            "description": "General CIB Operations",
            "usage": "45387 / 2.7 TiB"
        },
        {
            "name": "Core",
            "description": "General CIB Operations",
            "usage": "45387 / 2.7 TiB"
        },
        {
            "name": "Core",
            "description": "General CIB Operations",
            "usage": "45387 / 2.7 TiB"
        },
        {
            "name": "Core",
            "description": "General CIB Operations",
            "usage": "45387 / 2.7 TiB"
        },
        {
            "name": "Core",
            "description": "General CIB Operations",
            "usage": "45387 / 2.7 TiB"
        },
        {
            "name": "Core",
            "description": "General CIB Operations",
            "usage": "45387 / 2.7 TiB"
        },
        {
            "name": "Core",
            "description": "General CIB Operations",
            "usage": "45387 / 2.7 TiB"
        }

    ])