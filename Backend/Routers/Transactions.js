import express from 'express';
import { body, validationResult } from 'express-validator';
import { addTransactionController, deleteTransactionController, getAllTransactionController, updateTransactionController } from '../controllers/transactionController.js';
import Transaction from '../models/TransactionModel.js'; // Assuming the Transaction model is defined in this file

const router = express.Router();

// Validation for adding a transaction
router.route("/addTransaction").post(
  [
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('description').notEmpty().withMessage('Description is required'),
    body('date').isISO8601().withMessage('Date must be a valid date'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    addTransactionController(req, res);
  }
);

router.route("/getTransaction").post(getAllTransactionController);

router.route("/deleteTransaction/:id").post(deleteTransactionController);

// Route for multi-deletion of transactions
router.route("/deleteTransactions").post(async (req, res) => {
    const { ids } = req.body; // Expecting an array of transaction IDs
    try {
        await Transaction.deleteMany({ _id: { $in: ids } });
        return res.status(200).json({
            success: true,
            message: "Transactions deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// Route for fetching a single transaction detail
router.route("/getTransaction/:id").get(async (req, res) => {
    const { id } = req.params;
    try {
        const transaction = await Transaction.findById(id);
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }
        return res.status(200).json({
            success: true,
            transaction,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// Validation for updating a transaction
router.route('/updateTransaction/:id').put(
  [
    body('amount').optional().isNumeric().withMessage('Amount must be a number'),
    body('description').optional().notEmpty().withMessage('Description is required'),
    body('date').optional().isISO8601().withMessage('Date must be a valid date'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    updateTransactionController(req, res);
  }
);

export default router;