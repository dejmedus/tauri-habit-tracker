import { useState } from "react";

const Modal = ({ modal, setModal, habits, updateHabits }) => {
  const [deleteModal, setDeleteModal] = useState(null);

  // update habit schedule
  function toggleScheduleDate(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    let element = e.target as HTMLButtonElement;

    const dayNum = parseInt(element.value);
    let newSchedule = modal.schedule;

    newSchedule = newSchedule.includes(dayNum)
      ? newSchedule.filter((a: number) => a != dayNum)
      : [...newSchedule, dayNum];

    setModal({ ...modal, schedule: newSchedule });
  }

  return (
    <>
      <div className="modal">
        <svg
          onClick={() => setModal(null)}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            let updatedArr = [...habits];
            updatedArr[modal.habitIndex].name = modal.name;
            updatedArr[modal.habitIndex].schedule = modal.schedule;
            updatedArr[modal.habitIndex].color = modal.color;
            updateHabits(updatedArr);
            setModal(null);
          }}
        >
          <div className="form-container">
            <input
              onChange={(e) => setModal({ ...modal, name: e.target.value })}
              value={modal.name}
              placeholder={modal.name}
            />
            <p>
              Longest Streak: {modal.longestStreak}{" "}
              {modal.longestStreak !== 0 && modal.streak == modal.longestStreak
                ? "🔥"
                : null}
            </p>
            <p>Current Streak: {modal.streak}</p>

            <label htmlFor="colors">Color:</label>
            <select
              id="colors"
              value={modal.color}
              onChange={(e) => setModal({ ...modal, color: e.target.value })}
            >
              <option value="purple">Purple</option>
              <option value="sky">Sky</option>
              <option value="pink">Pink</option>
              <option value="yellow">Yellow</option>
              <option value="blue">Blue</option>
              <option value="red">Red</option>
              <option value="green">Green</option>
              <option value="orange">Orange</option>
            </select>

            <div className="history flex">
              {[
                ...new Array(120 - modal.days.length).fill(false),
                ...modal.days,
              ]
                .slice(-120)
                .map((day: boolean) => {
                  return (
                    <div
                      className={day ? `complete ${modal.color}` : null}
                    ></div>
                  );
                })}
            </div>

            <div className="schedule flex">
              <button
                className={
                  modal.schedule.includes(0) ? `selected ${modal.color}` : ""
                }
                value="0"
                onClick={toggleScheduleDate}
              >
                S
              </button>
              <button
                className={
                  modal.schedule.includes(1) ? `selected ${modal.color}` : ""
                }
                value="1"
                onClick={toggleScheduleDate}
              >
                M
              </button>
              <button
                className={
                  modal.schedule.includes(2) ? `selected ${modal.color}` : ""
                }
                value="2"
                onClick={toggleScheduleDate}
              >
                T
              </button>
              <button
                className={
                  modal.schedule.includes(3) ? `selected ${modal.color}` : ""
                }
                value="3"
                onClick={toggleScheduleDate}
              >
                W
              </button>
              <button
                className={
                  modal.schedule.includes(4) ? `selected ${modal.color}` : ""
                }
                value="4"
                onClick={toggleScheduleDate}
              >
                Th
              </button>
              <button
                className={
                  modal.schedule.includes(5) ? `selected ${modal.color}` : ""
                }
                value="5"
                onClick={toggleScheduleDate}
              >
                F
              </button>
              <button
                className={
                  modal.schedule.includes(6) ? `selected ${modal.color}` : ""
                }
                value="6"
                onClick={toggleScheduleDate}
              >
                S
              </button>
            </div>
            <button
              className="link-button"
              value={modal.habitIndex}
              onClick={(e: React.MouseEvent<HTMLButtonElement>): void => {
                let element = e.target as HTMLButtonElement;
                e.preventDefault();
                setDeleteModal(parseInt(element.value));
              }}
            >
              Delete
            </button>
          </div>
          <button type="submit">Save</button>
        </form>
      </div>

      {deleteModal !== null ? (
        <div className="deleteModal">
          Are you sure you want to delete{" "}
          <span>{habits[deleteModal].name}</span>?
          <div className="flex">
            <button
              onClick={() => {
                setDeleteModal(null);
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // delete habit
                let updatedArr = [...habits];
                updatedArr.splice(deleteModal, 1);
                updateHabits(updatedArr);
                setDeleteModal(null);
                setModal(null);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Modal;
