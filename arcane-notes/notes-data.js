/*
  notes-data.js
  ----------------------------------------------------------------
  This file holds ALL the written content for the notes app.
  Keeping content separate from HTML/CSS/JS logic means you can
  add, edit, or reorder notes just by editing this array — nothing
  else in the project needs to change.

  Structure:
  NOTES_DATA = [
    {
      id:       "unique-section-id"   -> used for sidebar links + scroll targets
      title:    "Section title"       -> shown in sidebar and as a page heading
      sigil:    "unicode symbol"      -> small decorative glyph (NOT an emoji)
      summary:  "short description"   -> shown under the section heading
      topics: [
        {
          title:   "Sub-topic title"
          body:    "explanation text (can include simple <p>/<ul> HTML)"
          code:    { lang: "python", snippet: "...code..." }  (optional)
        }
      ]
    },
    ...
  ]
*/

const NOTES_DATA = [
  // ------------------------------------------------------------
  // 1. PYTHON BASICS
  // ------------------------------------------------------------
  {
    id: "python-basics",
    title: "Python Basics",
    sigil: "&#10022;",
    summary: "The foundational spellwork — syntax, variables, control flow, and functions every incantation builds on.",
    topics: [
      {
        title: "Variables & Data Types",
        body: `<p>Python is dynamically typed — a variable's type is inferred at runtime and can change as the program runs. The core primitive types you'll use constantly in AI/ML work are <code>int</code>, <code>float</code>, <code>str</code>, <code>bool</code>, and <code>None</code>.</p>
               <ul>
                 <li><strong>int / float</strong> — numeric types; division with <code>/</code> always returns a float.</li>
                 <li><strong>str</strong> — immutable text sequences, sliceable like lists.</li>
                 <li><strong>bool</strong> — <code>True</code> / <code>False</code>, used constantly in masking and filtering.</li>
                 <li><strong>None</strong> — represents "no value", similar to <code>null</code> in other languages.</li>
               </ul>`,
        code: {
          lang: "python",
          snippet:
`# Dynamic typing in action
percentile = 97.5           # float
age = 50                    # int
myname = "vivi"             # str
istopper = False            # bool
best_weights = None         # placeholder until training finishes

print(type(percentile), type(age))
# <class 'float'> <class 'int'>

# f-strings are the standard way to format text
print(f"Training {myname} for {age} epochs at lr={learning_rate}")`
        }
      },
      {
        title: "Control Flow",
        body: `<p><code>if</code> / <code>elif</code> / <code>else</code> branches, and <code>for</code> / <code>while</code> loops, are the backbone of any data preprocessing or training loop you'll write.</p>`,
        code: {
          lang: "python",
          snippet:
`accuracy = 0.87

if accuracy >= 0.9:
    verdict = "excellent"
elif accuracy >= 0.75:
    verdict = "solid baseline"
else:
    verdict = "needs more work"

print(verdict)  # solid baseline

# Looping over epochs with early stopping
patience = 3
no_improve = 0
best_loss = float("inf")

for epoch in range(100):
    current_loss = 0.5 / (epoch + 1)   # pretend this is real loss
    if current_loss < best_loss:
        best_loss = current_loss
        no_improve = 0
    else:
        no_improve += 1
    if no_improve >= patience:
        print(f"Stopped early at epoch {epoch}")
        break`
        }
      },
      {
        title: "Functions & Lambdas",
        body: `<p>Functions defined with <code>def</code> support default arguments, keyword arguments, and type hints. <code>lambda</code> gives you small anonymous functions, often used inline with <code>map</code>, <code>filter</code>, or as a <code>key</code> for sorting.</p>`,
        code: {
          lang: "python",
          snippet:
`def normalize(values: list[float], min_val: float = 0.0, max_val: float = 1.0) -> list[float]:
    """Rescale a list of numbers into [min_val, max_val]."""
    lo, hi = min(values), max(values)
    span = hi - lo or 1  # avoid divide-by-zero
    return [min_val + (v - lo) / span * (max_val - min_val) for v in values]

scores = [12, 45, 7, 100, 33]
print(normalize(scores))

# Lambda as a sort key — sort predictions by confidence, descending
predictions = [("cat", 0.42), ("dog", 0.91), ("fox", 0.63)]
predictions.sort(key=lambda pair: pair[1], reverse=True)
print(predictions)`
        }
      },
      {
        title: "List Comprehensions",
        body: `<p>A compact, Pythonic way to build lists (and dicts/sets) from an iterable, often replacing a multi-line <code>for</code> loop with a single readable expression. Heavily used when prepping features before they even reach NumPy or Pandas.</p>`,
        code: {
          lang: "python",
          snippet:
`raw = [-4, 9, -1, 16, 0, 25]

# Only keep non-negative values, then square them
squared_nonneg = [x ** 2 for x in raw if x >= 0]
print(squared_nonneg)  # [81, 256, 0, 625]

# Dict comprehension: map class labels to integer ids
labels = ["cat", "dog", "fox"]
label_to_id = {label: idx for idx, label in enumerate(labels)}
print(label_to_id)  # {'cat': 0, 'dog': 1, 'fox': 2}`
        }
      }
    ]
  },

  // ------------------------------------------------------------
  // 2. DATA STRUCTURES
  // ------------------------------------------------------------
  {
    id: "data-structures",
    title: "Data Structures",
    sigil: "&#10038;",
    summary: "Lists, tuples, dictionaries, sets, and the collections module — the containers that hold everything else.",
    topics: [
      {
        title: "Lists & Tuples",
        body: `<p><strong>Lists</strong> are mutable ordered sequences — the default container for anything that changes size. <strong>Tuples</strong> are immutable ordered sequences, often used for fixed-size records like coordinates or a (feature, label) pair.</p>`,
        code: {
          lang: "python",
          snippet:
`features = [0.2, 0.9, 0.4]   # mutable — can append, remove, sort
features.append(0.7)
features[0] = 0.25

point = (48.85, 2.35)         # immutable — safe to use as a dict key
lat, lon = point               # tuple unpacking
print(lat, lon)

# A common ML pattern: pairing samples with labels
dataset = [(0.2, "cat"), (0.9, "dog"), (0.4, "fox")]
for value, label in dataset:
    print(f"{label}: {value}")`
        }
      },
      {
        title: "Dictionaries & Sets",
        body: `<p><strong>Dicts</strong> map keys to values in O(1) average lookup time — perfect for configs, vocabularies, and label encodings. <strong>Sets</strong> store unique unordered elements and are ideal for deduplication and fast membership tests.</p>`,
        code: {
          lang: "python",
          snippet:
`config = {
    "learning_rate": 0.01,
    "batch_size": 32,
    "optimizer": "adam"
}
config["epochs"] = 20          # add a new key
print(config.get("dropout", 0.0))  # safe default lookup

# Sets remove duplicates instantly
seen_words = set()
corpus = ["gpu", "cpu", "gpu", "tpu", "cpu"]
unique_hardware = set(corpus)
print(unique_hardware)  # {'gpu', 'cpu', 'tpu'}

# Fast membership test — O(1) average
print("tpu" in unique_hardware)  # True`
        }
      },
      {
        title: "collections: deque, Counter, defaultdict",
        body: `<p>The <code>collections</code> module extends the built-ins. <code>deque</code> gives fast appends/pops from both ends (great for sliding windows or BFS). <code>Counter</code> tallies frequencies instantly. <code>defaultdict</code> removes the need for manual key-existence checks.</p>`,
        code: {
          lang: "python",
          snippet:
`from collections import deque, Counter, defaultdict

# deque as a fixed-size sliding window over a training metric
recent_losses = deque(maxlen=5)
for loss in [0.9, 0.7, 0.5, 0.4, 0.35, 0.3]:
    recent_losses.append(loss)
print(list(recent_losses))  # keeps only the last 5

# Counter for a quick class-balance check
labels = ["cat", "dog", "cat", "fox", "dog", "cat"]
print(Counter(labels))  # Counter({'cat': 3, 'dog': 2, 'fox': 1})

# defaultdict avoids KeyError when grouping
groups = defaultdict(list)
for value, label in [(0.2, "cat"), (0.9, "dog"), (0.4, "cat")]:
    groups[label].append(value)
print(dict(groups))`
        }
      }
    ]
  },

  // ------------------------------------------------------------
  // 3. OBJECT-ORIENTED PROGRAMMING
  // ------------------------------------------------------------
  {
    id: "oop",
    title: "OOP",
    sigil: "&#10039;",
    summary: "Classes, inheritance, and dunder methods — how most ML frameworks structure models under the hood.",
    topics: [
      {
        title: "Classes & Objects",
        body: `<p>A class bundles data (attributes) and behavior (methods) together. Almost every model you build in PyTorch or scikit-learn's custom estimators follows this exact pattern: an <code>__init__</code> to set up state, and methods that operate on it.</p>`,
        code: {
          lang: "python",
          snippet:
`class LinearModel:
    def __init__(self, weight: float = 0.0, bias: float = 0.0):
        self.weight = weight
        self.bias = bias

    def predict(self, x: float) -> float:
        return self.weight * x + self.bias

    def update(self, grad_w: float, grad_b: float, lr: float = 0.01):
        self.weight -= lr * grad_w
        self.bias -= lr * grad_b

model = LinearModel(weight=2.0, bias=1.0)
print(model.predict(3))  # 7.0`
        }
      },
      {
        title: "Inheritance & Polymorphism",
        body: `<p>Inheritance lets a subclass reuse and extend a parent class's behavior. Polymorphism means different classes can be used through the same interface — this is exactly how scikit-learn estimators all expose <code>.fit()</code> and <code>.predict()</code> regardless of the algorithm underneath.</p>`,
        code: {
          lang: "python",
          snippet:
`class BaseModel:
    def fit(self, X, y):
        raise NotImplementedError

    def predict(self, X):
        raise NotImplementedError

class MeanBaseline(BaseModel):
    def fit(self, X, y):
        self.mean_ = sum(y) / len(y)
        return self

    def predict(self, X):
        return [self.mean_ for _ in X]

class AlwaysPositive(BaseModel):
    def fit(self, X, y):
        return self

    def predict(self, X):
        return [1 for _ in X]

# Polymorphism: same loop works for any BaseModel subclass
for model in [MeanBaseline(), AlwaysPositive()]:
    model.fit([0, 1, 2], [3.0, 4.0, 5.0])
    print(type(model).__name__, model.predict([0, 1, 2]))`
        }
      },
      {
        title: "Dunder (Magic) Methods",
        body: `<p>Methods like <code>__init__</code>, <code>__repr__</code>, <code>__len__</code>, and <code>__call__</code> let your objects integrate naturally with Python's built-in syntax — printing, indexing, iterating, or calling the object directly.</p>`,
        code: {
          lang: "python",
          snippet:
`class Dataset:
    def __init__(self, samples: list):
        self.samples = samples

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        return self.samples[idx]

    def __repr__(self):
        return f"Dataset(n={len(self)})"

ds = Dataset([0.1, 0.5, 0.9, 0.3])
print(len(ds))       # 4  -> uses __len__
print(ds[2])         # 0.9 -> uses __getitem__
print(ds)             # Dataset(n=4) -> uses __repr__`
        }
      }
    ]
  },

  // ------------------------------------------------------------
  // 4. NUMPY
  // ------------------------------------------------------------
  {
    id: "numpy",
    title: "NumPy",
    sigil: "&#10021;",
    summary: "Fast n-dimensional arrays and vectorized math — the numerical bedrock underneath almost every ML library.",
    topics: [
      {
        title: "Arrays & Creation",
        body: `<p>A NumPy <code>ndarray</code> is a fixed-type, contiguous block of memory — far faster than a Python list for numerical work because operations run in optimized C loops instead of the Python interpreter.</p>`,
        code: {
          lang: "python",
          snippet:
`import numpy as np

a = np.array([1, 2, 3, 4])
zeros = np.zeros((3, 3))          # 3x3 matrix of zeros
ones = np.ones((2, 4))            # 2x4 matrix of ones
identity = np.eye(3)              # 3x3 identity matrix
rand = np.random.randn(2, 2)      # samples from a standard normal

print(a.shape, a.dtype)   # (4,) int64
print(zeros.shape)         # (3, 3)`
        }
      },
      {
        title: "Indexing, Slicing & Broadcasting",
        body: `<p>NumPy supports powerful slicing across any number of dimensions, plus boolean masking for filtering. <strong>Broadcasting</strong> lets arrays of different shapes be combined in arithmetic without writing explicit loops.</p>`,
        code: {
          lang: "python",
          snippet:
`m = np.array([[1, 2, 3],
              [4, 5, 6],
              [7, 8, 9]])

print(m[1, :])       # second row -> [4 5 6]
print(m[:, 0])       # first column -> [1 4 7]
print(m[m > 5])      # boolean mask -> [6 7 8 9]

# Broadcasting: add a 1D array to every row of a 2D array
row_means = m.mean(axis=1, keepdims=True)  # shape (3, 1)
centered = m - row_means                   # broadcasts across columns
print(centered)`
        }
      },
      {
        title: "Vectorized Math",
        body: `<p>Vectorization replaces explicit Python loops with array-wide operations — this is the single biggest performance habit to build, and the reason NumPy underlies pandas, scikit-learn, and PyTorch tensors.</p>`,
        code: {
          lang: "python",
          snippet:
`x = np.array([1.0, 2.0, 3.0, 4.0])
w = np.array([0.5, -1.0, 2.0, 0.25])

# Dot product — the core operation behind a linear layer
z = np.dot(x, w)
print(z)  # 6.5

# Vectorized sigmoid, applied to the whole array at once
def sigmoid(v):
    return 1 / (1 + np.exp(-v))

print(sigmoid(x))  # array of 4 sigmoid outputs, no explicit loop`
        }
      }
    ]
  },

  // ------------------------------------------------------------
  // 5. PANDAS
  // ------------------------------------------------------------
  {
    id: "pandas",
    title: "Pandas",
    sigil: "&#10020;",
    summary: "DataFrames, cleaning, and groupby — turning messy tabular data into something a model can actually learn from.",
    topics: [
      {
        title: "DataFrames & Series",
        body: `<p>A <code>Series</code> is a single labeled column; a <code>DataFrame</code> is a labeled table of Series sharing an index. Almost every tabular dataset you load for ML ends up as a DataFrame.</p>`,
        code: {
          lang: "python",
          snippet:
`import pandas as pd

df = pd.DataFrame({
    "age": [23, 45, 31, 22],
    "income": [40000, 82000, 51000, 39000],
    "purchased": [0, 1, 1, 0]
})

print(df.head())
print(df.dtypes)
print(df["income"].mean())   # Series methods work directly on a column`
        }
      },
      {
        title: "Data Cleaning",
        body: `<p>Real datasets have missing values, duplicates, and wrong types. Pandas gives concise tools to detect and fix all three before any modeling begins.</p>`,
        code: {
          lang: "python",
          snippet:
`df.loc[1, "income"] = None       # simulate a missing value

print(df.isna().sum())           # count missing values per column

df["income"] = df["income"].fillna(df["income"].median())
df = df.drop_duplicates()

df["age_group"] = pd.cut(df["age"], bins=[0, 25, 40, 100],
                          labels=["young", "adult", "senior"])
print(df)`
        }
      },
      {
        title: "GroupBy & Aggregation",
        body: `<p><code>groupby</code> splits a DataFrame into groups, applies a function to each, then combines the results — the classic split-apply-combine pattern used constantly for feature engineering.</p>`,
        code: {
          lang: "python",
          snippet:
`summary = df.groupby("age_group")["income"].agg(["mean", "count"])
print(summary)

# Multiple aggregations across multiple columns at once
report = df.groupby("purchased").agg(
    avg_age=("age", "mean"),
    avg_income=("income", "mean"),
    total=("purchased", "count")
)
print(report)`
        }
      }
    ]
  },

  // ------------------------------------------------------------
  // 6. MATPLOTLIB
  // ------------------------------------------------------------
  {
    id: "matplotlib",
    title: "Matplotlib",
    sigil: "✴",
    summary: "Plots, subplots, and styling — visualizing data and model results so patterns are actually legible.",
    topics: [
      {
        title: "Basic Plots",
        body: `<p>The <code>pyplot</code> interface covers most everyday plotting: line charts for trends, scatter plots for relationships, and histograms for distributions.</p>`,
        code: {
          lang: "python",
          snippet:
`import matplotlib.pyplot as plt

epochs = list(range(1, 11))
loss = [1/e for e in epochs]

plt.plot(epochs, loss, marker="o", label="training loss")
plt.xlabel("Epoch")
plt.ylabel("Loss")
plt.title("Training Loss Curve")
plt.legend()
plt.show()`
        }
      },
      {
        title: "Subplots & Styling",
        body: `<p><code>plt.subplots</code> arranges multiple axes on one figure — useful for comparing training vs validation curves, or several features side by side, in a single glance.</p>`,
        code: {
          lang: "python",
          snippet:
`fig, axes = plt.subplots(1, 2, figsize=(10, 4))

axes[0].plot(epochs, loss, color="mediumpurple")
axes[0].set_title("Loss")

acc = [1 - l for l in loss]
axes[1].plot(epochs, acc, color="seagreen")
axes[1].set_title("Accuracy")

plt.tight_layout()
plt.show()`
        }
      },
      {
        title: "Visualizing Model Results",
        body: `<p>Confusion matrices, ROC curves, and residual plots are the standard visuals for judging whether a trained model is actually good — matplotlib (often via scikit-learn's plotting helpers) renders all of them.</p>`,
        code: {
          lang: "python",
          snippet:
`import numpy as np

y_true = np.array([0, 1, 1, 0, 1, 0, 1, 1])
y_pred = np.array([0, 1, 0, 0, 1, 1, 1, 1])

# Manually building a 2x2 confusion matrix
tp = np.sum((y_true == 1) & (y_pred == 1))
tn = np.sum((y_true == 0) & (y_pred == 0))
fp = np.sum((y_true == 0) & (y_pred == 1))
fn = np.sum((y_true == 1) & (y_pred == 0))

matrix = np.array([[tn, fp], [fn, tp]])

plt.imshow(matrix, cmap="Purples")
plt.title("Confusion Matrix")
plt.xticks([0, 1], ["Pred 0", "Pred 1"])
plt.yticks([0, 1], ["True 0", "True 1"])
for (i, j), val in np.ndenumerate(matrix):
    plt.text(j, i, str(val), ha="center", va="center")
plt.show()`
        }
      }
    ]
  },

  // ------------------------------------------------------------
  // 7. SCIKIT-LEARN
  // ------------------------------------------------------------
  {
    id: "scikit-learn",
    title: "Scikit-Learn",
    sigil: "&#10070;",
    summary: "The standard toolkit for classical ML — consistent fit/predict APIs, pipelines, and evaluation metrics.",
    topics: [
      {
        title: "Train/Test Split & Pipelines",
        body: `<p>Splitting data before touching it prevents leakage; a <code>Pipeline</code> chains preprocessing and modeling steps into one object, so the exact same transformations are applied at train and inference time.</p>`,
        code: {
          lang: "python",
          snippet:
`from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("classifier", LogisticRegression())
])

pipe.fit(X_train, y_train)
predictions = pipe.predict(X_test)`
        }
      },
      {
        title: "Common Models",
        body: `<p>Every estimator, regardless of algorithm, shares the same interface: <code>.fit(X, y)</code> to train, <code>.predict(X)</code> to infer. This consistency is what makes scikit-learn so easy to swap models within.</p>`,
        code: {
          lang: "python",
          snippet:
`from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC

models = {
    "tree": DecisionTreeClassifier(max_depth=4),
    "forest": RandomForestClassifier(n_estimators=100),
    "svm": SVC(kernel="rbf")
}

for name, model in models.items():
    model.fit(X_train, y_train)
    score = model.score(X_test, y_test)
    print(f"{name}: {score:.3f}")`
        }
      },
      {
        title: "Evaluation Metrics",
        body: `<p>Accuracy alone can be misleading, especially on imbalanced data. Precision, recall, F1, and the confusion matrix together give a fuller picture of where a model actually succeeds or fails.</p>`,
        code: {
          lang: "python",
          snippet:
`from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, confusion_matrix, classification_report
)

y_pred = pipe.predict(X_test)

print("Accuracy: ", accuracy_score(y_test, y_pred))
print("Precision:", precision_score(y_test, y_pred))
print("Recall:   ", recall_score(y_test, y_pred))
print("F1 score: ", f1_score(y_test, y_pred))
print(confusion_matrix(y_test, y_pred))
print(classification_report(y_test, y_pred))`
        }
      }
    ]
  }
];