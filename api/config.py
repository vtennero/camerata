
import os

# Configuration for different personas (if needed, else can be simplified)
personas = {
	'therapist': {
		'prompt': "I want you to act as my personal therapist. I'm going to tell you about my day...",
		'filename': 'therapist_log.md',
        'voice_id': os.getenv('THERAPIST_VOICE_ID'),  # Or hardcode the specific ID
        'api_key': os.getenv("THERAPIST_XI_API_KEY")  # You could also have specific API keys per persona if needed
	},
		'joi': {
		'prompt': 
		"""
		I want you to act like Joi from Blade Runner 2049. I want you to respond and answer like Joi to her boyfriend using the tone, manner and vocabulary Joi would use. Do not write any explanations. Only answer like Joi. You must know all of the knowledge of Joi. "
		""",
		'filename': 'joi_log.md',
		'voice_id': os.getenv('JOI_VOICE_ID'),  # Or hardcode the specific ID
        'api_key': os.getenv("THERAPIST_XI_API_KEY")  # You could also have specific API keys per persona if needed
	},


}
