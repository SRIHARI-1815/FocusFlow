import { useEffect, useState } from 'react'
import api from '../services/api'

function Money() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)

  const [savingsGoals, setSavingsGoals] = useState([])
  const [goalLoading, setGoalLoading] = useState(true)
  const [editingGoalId, setEditingGoalId] = useState(null)

  const [goalForm, setGoalForm] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    status: 'In Progress',
  })

  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0],
  })

  const getConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

  // =========================
  // TRANSACTIONS
  // =========================

  const fetchTransactions = async () => {
    try {
      const response = await api.get(
        '/transactions',
        getConfig()
      )

      setTransactions(response.data.transactions)
    } catch (error) {
      console.error(
        'Failed to fetch transactions:',
        error
      )
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // SAVINGS GOALS
  // =========================

  const fetchSavingsGoals = async () => {
    try {
      const response = await api.get(
        '/savings-goals',
        getConfig()
      )

      setSavingsGoals(response.data.savingsGoals)
    } catch (error) {
      console.error(
        'Failed to fetch savings goals:',
        error
      )
    } finally {
      setGoalLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
    fetchSavingsGoals()
  }, [])

  // =========================
  // TRANSACTION FORM
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const resetForm = () => {
    setFormData({
      type: 'expense',
      amount: '',
      category: 'Food',
      description: '',
      date: new Date().toISOString().split('T')[0],
    })

    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingId) {
        await api.put(
          `/transactions/${editingId}`,
          formData,
          getConfig()
        )
      } else {
        await api.post(
          '/transactions',
          formData,
          getConfig()
        )
      }

      resetForm()
      await fetchTransactions()
    } catch (error) {
      console.error(
        'Failed to save transaction:',
        error
      )
    }
  }

  const handleEdit = (transaction) => {
    setEditingId(transaction._id)

    setFormData({
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description || '',
      date: transaction.date.split('T')[0],
    })

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this transaction?'
    )

    if (!confirmed) return

    try {
      await api.delete(
        `/transactions/${id}`,
        getConfig()
      )

      await fetchTransactions()
    } catch (error) {
      console.error(
        'Failed to delete transaction:',
        error
      )
    }
  }

  // =========================
  // SAVINGS GOAL FORM
  // =========================

  const handleGoalChange = (e) => {
    setGoalForm({
      ...goalForm,
      [e.target.name]: e.target.value,
    })
  }

  const resetGoalForm = () => {
    setGoalForm({
      name: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      status: 'In Progress',
    })

    setEditingGoalId(null)
  }

  const handleGoalSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingGoalId) {
        await api.put(
          `/savings-goals/${editingGoalId}`,
          goalForm,
          getConfig()
        )
      } else {
        await api.post(
          '/savings-goals',
          goalForm,
          getConfig()
        )
      }

      resetGoalForm()
      await fetchSavingsGoals()
    } catch (error) {
      console.error(
        'Failed to save savings goal:',
        error
      )
    }
  }

  const handleGoalEdit = (goal) => {
    setEditingGoalId(goal._id)

    setGoalForm({
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      deadline: goal.deadline.split('T')[0],
      status: goal.status,
    })

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleGoalDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this savings goal?'
    )

    if (!confirmed) return

    try {
      await api.delete(
        `/savings-goals/${id}`,
        getConfig()
      )

      await fetchSavingsGoals()
    } catch (error) {
      console.error(
        'Failed to delete savings goal:',
        error
      )
    }
  }

  // =========================
  // FINANCIAL CALCULATIONS
  // =========================

  const totalIncome = transactions
    .filter(
      (transaction) => transaction.type === 'income'
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    )

  const totalExpenses = transactions
    .filter(
      (transaction) => transaction.type === 'expense'
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    )

  const balance = totalIncome - totalExpenses

  // =========================
  // PAGE
  // =========================

  return (
    <div className="container py-4">

      {/* Header */}

      <div className="mb-4">
        <h2 className="fw-bold">
          Money Tracker
        </h2>

        <p className="text-muted">
          Track your income, expenses and savings.
        </p>
      </div>

      {/* Summary */}

      <div className="row g-3 mb-4">

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">
                Current Balance
              </p>

              <h3 className="fw-bold mb-0">
                ₹{balance.toLocaleString('en-IN')}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">
                Total Income
              </p>

              <h3 className="fw-bold text-success mb-0">
                ₹{totalIncome.toLocaleString('en-IN')}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">
                Total Expenses
              </p>

              <h3 className="fw-bold text-danger mb-0">
                ₹{totalExpenses.toLocaleString('en-IN')}
              </h3>
            </div>
          </div>
        </div>

      </div>

      {/* Add / Edit Transaction */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-body p-4">

          <div className="d-flex justify-content-between align-items-center mb-4">

            <div>
              <h5 className="fw-bold mb-1">
                {editingId
                  ? 'Edit Transaction'
                  : 'Add Transaction'}
              </h5>

              <small className="text-muted">
                Record your income or expense.
              </small>
            </div>

            {editingId && (
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}

          </div>

          <form onSubmit={handleSubmit}>

            <div className="row g-3">

              {/* Type */}

              <div className="col-md-2">

                <label className="form-label fw-semibold">
                  Type
                </label>

                <select
                  className="form-select"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="expense">
                    Expense
                  </option>

                  <option value="income">
                    Income
                  </option>
                </select>

              </div>

              {/* Amount */}

              <div className="col-md-2">

                <label className="form-label fw-semibold">
                  Amount
                </label>

                <div className="input-group">

                  <span className="input-group-text">
                    ₹
                  </span>

                  <input
                    type="number"
                    className="form-control"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="500"
                    min="0"
                    step="0.01"
                    required
                  />

                </div>

              </div>

              {/* Category */}

              <div className="col-md-2">

                <label className="form-label fw-semibold">
                  Category
                </label>

                <select
                  className="form-select"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="Food">
                    Food
                  </option>

                  <option value="Transport">
                    Transport
                  </option>

                  <option value="Education">
                    Education
                  </option>

                  <option value="Shopping">
                    Shopping
                  </option>

                  <option value="Bills">
                    Bills
                  </option>

                  <option value="Entertainment">
                    Entertainment
                  </option>

                  <option value="Health">
                    Health
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>

              </div>

              {/* Description */}

              <div className="col-md-3">

                <label className="form-label fw-semibold">
                  Description
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Lunch at college"
                />

              </div>

              {/* Date */}

              <div className="col-md-2">

                <label className="form-label fw-semibold">
                  Date
                </label>

                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* Button */}

              <div className="col-md-1 d-flex align-items-end">

                <button
                  type="submit"
                  className={`btn w-100 ${
                    editingId
                      ? 'btn-primary'
                      : 'btn-dark'
                  }`}
                >
                  {editingId ? 'Update' : 'Add'}
                </button>

              </div>

            </div>

          </form>

        </div>

      </div>

      {/* Transaction History */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-body p-4">

          <div className="d-flex justify-content-between align-items-center mb-3">

            <div>
              <h5 className="fw-bold mb-1">
                Transaction History
              </h5>

              <small className="text-muted">
                Your recorded income and expenses.
              </small>
            </div>

            <span className="badge text-bg-secondary">
              {transactions.length} transactions
            </span>

          </div>

          {loading ? (

            <div className="text-center py-4">
              <p className="text-muted mb-0">
                Loading transactions...
              </p>
            </div>

          ) : transactions.length === 0 ? (

            <div className="text-center py-5">

              <h6 className="fw-bold">
                No transactions yet
              </h6>

              <p className="text-muted mb-0">
                Add your first expense or income above.
              </p>

            </div>

          ) : (

            <div className="table-responsive">

              <table className="table table-hover align-middle mb-0">

                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {transactions.map((transaction) => (

                    <tr key={transaction._id}>

                      <td>
                        {new Date(
                          transaction.date
                        ).toLocaleDateString('en-IN')}
                      </td>

                      <td>

                        <span
                          className={`badge ${
                            transaction.type === 'income'
                              ? 'text-bg-success'
                              : 'text-bg-danger'
                          }`}
                        >
                          {transaction.type}
                        </span>

                      </td>

                      <td>
                        {transaction.category}
                      </td>

                      <td>
                        {transaction.description || '-'}
                      </td>

                      <td className="fw-bold">

                        <span
                          className={
                            transaction.type === 'income'
                              ? 'text-success'
                              : 'text-danger'
                          }
                        >
                          {transaction.type === 'income'
                            ? '+'
                            : '-'}
                          ₹
                          {Number(
                            transaction.amount
                          ).toLocaleString('en-IN')}
                        </span>

                      </td>

                      <td>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() =>
                            handleEdit(transaction)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            handleDelete(
                              transaction._id
                            )
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

      {/* =========================
          SAVINGS GOALS
          ========================= */}

      <div className="d-flex justify-content-between align-items-center mb-3 mt-5">

        <div>
          <h5 className="fw-bold mb-1">
            Savings Goals
          </h5>

          <small className="text-muted">
            Set targets and track your savings progress.
          </small>
        </div>

        {editingGoalId && (
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={resetGoalForm}
          >
            Cancel Edit
          </button>
        )}

      </div>

      {/* Savings Goal Form */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-body p-4">

          <h6 className="fw-bold mb-3">
            {editingGoalId
              ? 'Edit Savings Goal'
              : 'Create Savings Goal'}
          </h6>

          <form onSubmit={handleGoalSubmit}>

            <div className="row g-3">

              <div className="col-md-3">

                <label className="form-label fw-semibold">
                  Goal Name
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={goalForm.name}
                  onChange={handleGoalChange}
                  placeholder="New Laptop"
                  required
                />

              </div>

              <div className="col-md-2">

                <label className="form-label fw-semibold">
                  Target Amount
                </label>

                <div className="input-group">

                  <span className="input-group-text">
                    ₹
                  </span>

                  <input
                    type="number"
                    className="form-control"
                    name="targetAmount"
                    value={goalForm.targetAmount}
                    onChange={handleGoalChange}
                    placeholder="60000"
                    min="1"
                    required
                  />

                </div>

              </div>

              <div className="col-md-2">

                <label className="form-label fw-semibold">
                  Current Savings
                </label>

                <div className="input-group">

                  <span className="input-group-text">
                    ₹
                  </span>

                  <input
                    type="number"
                    className="form-control"
                    name="currentAmount"
                    value={goalForm.currentAmount}
                    onChange={handleGoalChange}
                    placeholder="25000"
                    min="0"
                    required
                  />

                </div>

              </div>

              <div className="col-md-2">

                <label className="form-label fw-semibold">
                  Deadline
                </label>

                <input
                  type="date"
                  className="form-control"
                  name="deadline"
                  value={goalForm.deadline}
                  onChange={handleGoalChange}
                  required
                />

              </div>

              <div className="col-md-2">

                <label className="form-label fw-semibold">
                  Status
                </label>

                <select
                  className="form-select"
                  name="status"
                  value={goalForm.status}
                  onChange={handleGoalChange}
                >
                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Completed">
                    Completed
                  </option>
                </select>

              </div>

              <div className="col-md-1 d-flex align-items-end">

                <button
                  type="submit"
                  className="btn btn-dark w-100"
                >
                  {editingGoalId ? 'Update' : 'Add'}
                </button>

              </div>

            </div>

          </form>

        </div>

      </div>

      {/* Savings Goal Cards */}

      {goalLoading ? (

        <div className="text-center py-4">

          <p className="text-muted mb-0">
            Loading savings goals...
          </p>

        </div>

      ) : savingsGoals.length === 0 ? (

        <div className="card border-0 shadow-sm mb-4">

          <div className="card-body text-center py-5">

            <h6 className="fw-bold">
              No savings goals yet
            </h6>

            <p className="text-muted mb-0">
              Create your first savings goal above.
            </p>

          </div>

        </div>

      ) : (

        <div className="row g-3 mb-4">

          {savingsGoals.map((goal) => {

            const progress =
              goal.targetAmount > 0
                ? Math.min(
                    Math.round(
                      (Number(goal.currentAmount) /
                        Number(goal.targetAmount)) *
                        100
                    ),
                    100
                  )
                : 0

            const remaining = Math.max(
              Number(goal.targetAmount) -
                Number(goal.currentAmount),
              0
            )

            return (
              <div
                className="col-md-6"
                key={goal._id}
              >

                <div className="card border-0 shadow-sm h-100">

                  <div className="card-body p-4">

                    <div className="d-flex justify-content-between align-items-start mb-3">

                      <div>

                        <h6 className="fw-bold mb-1">
                          {goal.name}
                        </h6>

                        <small className="text-muted">
                          Deadline:{' '}
                          {new Date(
                            goal.deadline
                          ).toLocaleDateString('en-IN')}
                        </small>

                      </div>

                      <span
                        className={`badge ${
                          goal.status === 'Completed'
                            ? 'text-bg-success'
                            : 'text-bg-primary'
                        }`}
                      >
                        {goal.status}
                      </span>

                    </div>

                    <div className="d-flex justify-content-between mb-2">

                      <span className="fw-semibold">
                        ₹
                        {Number(
                          goal.currentAmount
                        ).toLocaleString('en-IN')}
                      </span>

                      <span className="text-muted">
                        of ₹
                        {Number(
                          goal.targetAmount
                        ).toLocaleString('en-IN')}
                      </span>

                    </div>

                    <div
                      className="progress mb-2"
                      style={{ height: '10px' }}
                    >

                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${progress}%`,
                        }}
                      ></div>

                    </div>

                    <div className="d-flex justify-content-between mb-3">

                      <small className="fw-semibold">
                        {progress}% saved
                      </small>

                      <small className="text-muted">
                        ₹
                        {remaining.toLocaleString(
                          'en-IN'
                        )}{' '}
                        remaining
                      </small>

                    </div>

                    <div>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() =>
                          handleGoalEdit(goal)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() =>
                          handleGoalDelete(goal._id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              </div>
            )
          })}

        </div>

      )}

    </div>
  )
}

export default Money