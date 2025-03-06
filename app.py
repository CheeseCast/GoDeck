from flask import Flask, render_template, jsonify, request
import pulsectl

app = Flask(__name__)
pulse = pulsectl.Pulse('web-mixer')

def get_audio_sessions():
    sink_inputs = pulse.sink_input_list()
    audio_list = []
    
    for input in sink_inputs:
        # Get application properties
        props = input.proplist
        app_name = props.get('application.name', input.name)
        
        # Clean up the app name
        if app_name.endswith('.desktop'):
            app_name = app_name[:-8]
        app_name = app_name.replace('-', ' ').title()
        
        audio_list.append({
            'name': app_name,
            'volume': input.volume.value_flat,
            'muted': input.mute == 1,
            'index': input.index
        })
    
    return sorted(audio_list, key=lambda x: x['name'])

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/audio-sessions')
def audio_sessions():
    return jsonify(get_audio_sessions())

@app.route('/api/set-volume', methods=['POST'])
def set_volume():
    data = request.json
    index = int(data['index'])
    volume = float(data['volume'])
    
    try:
        # Find the sink input with matching index
        sink_inputs = pulse.sink_input_list()
        sink_input = next((input for input in sink_inputs if input.index == index), None)
        
        if sink_input is None:
            return jsonify({'success': False, 'error': 'Sink input not found'})
            
        pulse.volume_set_all_chans(sink_input, volume)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/toggle-mute', methods=['POST'])
def toggle_mute():
    data = request.json
    index = int(data['index'])
    
    try:
        # Find the sink input with matching index
        sink_inputs = pulse.sink_input_list()
        sink_input = next((input for input in sink_inputs if input.index == index), None)
        
        if sink_input is None:
            return jsonify({'success': False, 'error': 'Sink input not found'})
            
        pulse.mute(sink_input, not sink_input.mute)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
