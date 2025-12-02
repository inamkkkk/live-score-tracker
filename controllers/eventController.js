const Event = require('../models/Event');

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve events' });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const { name, team1, team2 } = req.body;
        const event = new Event({ name, team1, team2, score: { team1: 0, team2: 0 } });
        const savedEvent = await event.save();

        const io = req.app.get('socketio');
        io.emit('new_event', { event: savedEvent });

        res.status(201).json(savedEvent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create event' });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve event' });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update event' });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete event' });
    }
};

exports.updateEventScore = async (req, res) => {
    try {
        const { team1, team2 } = req.body.score;

        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.score = { team1, team2 };
        const updatedEvent = await event.save();

        const io = req.app.get('socketio');
        io.emit('score_update', { eventId: req.params.id, score: updatedEvent.score });

        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update event score' });
    }
};