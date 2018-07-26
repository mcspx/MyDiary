/* eslint no-underscore-dangle: 0 */
import EntryHandler from '../handler/entryHandler';
import ClientController from './clientController';

class EntryController extends ClientController {
  constructor() {
    super();
    this._entry = new EntryHandler();
  }

  create(req, res, next) {
    const action = `INSERT INTO entries(title, content, user_id, created_at, updated_at)
      VALUES($1, $2, $3, $4, $5) RETURNING title, content, created_at, updated_at `;
    const values = [req.body.title, req.body.content, req.userData.id, 'NOW()', 'NOW()'];
    const query = {
      text: action,
      values,
    };
    this._client.query(query)
      .then((result) => {
        res.status(201)
          .json({
            status: 'success',
            data: result.rows[0],
          });
      })
      .catch((e) => {
        next(e);
      });
  }

  getAll(req, res) {
    this._client.query('SELECT * FROM entries WHERE user_id=($1) ORDER BY id DESC', [req.userData.id])
      .then((result) => {
        res.status(200)
          .json({
            status: 'success',
            data: result.rows || [],
          });
      });
  }

  getById(req, res, next) {
    // using obj destructring
    const { id } = req.params;

    this._client.query('SELECT * FROM entries WHERE id=($1) AND user_id=($2)', [id, req.userData.id])
      .then((result) => {
        if (result.rowCount > 0) {
          res.status(200)
            .json({
              status: 'success',
              data: result.rows[0],
            });
        } else {
          const error = new Error("Entry doesn't exist");
          error.status = 404;
          next(error);
        }
      })
      .catch((e) => {
        next(e);
      });
  }


  update(req, res) {
    const { id } = req.params;
    const { body } = req;
    const result = this._entry.updateEntry(id, body);
    if (result !== null) {
      res.status(200)
        .json({
          status: 'success',
          data: result,
        });
    } else {
      // has error property to match the pattern of validation error response
      res.status(404)
        .json({
          status: 'error',
          message: 'Oops entry not found',
          errors: [
            "entry with id doesn't exist",
          ],
        });
    }
  }

  delete(req, res) {
    const { id } = req.params;
    const result = this._entry.deleteEntry(id);
    // if item was deleted successully, it will return undefined
    if (result !== null && result === undefined) {
      res.status(200)
        .json({
          status: 'success',
          data: {},
        });
    } else {
      // has error property to match the pattern of validation error response
      res.status(404)
        .json({
          status: 'error',
          message: 'Unable to delete entry',
          errors: [
            "entry with id doesn't exist",
          ],
        });
    }
  }
}

module.exports = EntryController;
