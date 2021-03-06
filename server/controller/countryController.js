const Country = require('../model/Country')
const { validationResult } = require('express-validator')
const State = require('../model/State');
const City = require('../model/City');

// Crear nuevo país
exports.createCountry = async (req, res) => {

    // Revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        // Extraer el nombre del país
        const { name } = req.body

        // Se determina si existe un país con el mismo nombre
        const exists = await Country.findOne({ where: {name: name} })
        if (exists) {
            return res.status(400).send(`The country with name ${name} is alredy exists`)
        }

        const country = await Country.create({name})
        res.status(200).send(`New country added: ${name}`)

    } catch (error) {
        console.log(error)
        return res.status(500).send('There was an error')
    }
}

// Obtener todos los países
exports.getCountries = async (req, res) => {
    try {
        const countries = await Country.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt' ] },
            include: { model: State, attributes: { exclude: ['createdAt', 'updatedAt', 'country_id'] },
            include: { model: City, attributes: { exclude: ['createdAt', 'updatedAt', 'state_id'] } } }
        })

        res.json({countries})
    } catch (error) {
        console.log(error)
        return res.status(500).send('There was an error')
    }
}

// Actualizar país
exports.updateCountry = async (req, res) => {

    // Revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Extraer nombre del pais
        const { name } = req.body

        // Obtener id de los parámetros
        const id = req.params.id

        // Verificar si existe el país con el id recibido como parámetro
        const country = await Country.findByPk(id)
        if (!country) {
            return res.status(404).send('Country not found')
        }

        country.set({
            name: name
        })
        await country.save()

        res.status(200).send({country})
    } catch (error) {
        console.log(error)
        return res.status(500).send('There was an error')
    }
}

// Eliminar país
exports.deleteCountry = async (req, res) => {
    try {
        // Extraer el id del país
        const id = req.params.id

        // Se verifica la existencia del país con el id recibido por parámetro
        const country = await Country.findByPk(id)
        if (!country) {
            return res.status(404).send('Country not found')
        }

        // Faltan verificaciones por si el país está asociado a un estado

        // Eliminar el país
        await country.destroy()
        res.status(200).send('Country deleted')

    } catch (error) {
        console.log(error)
        return res.status(500).send('There was an error')
    }
}