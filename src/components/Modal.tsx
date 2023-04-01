import { useState } from "react";
import { daysOfWeek } from "../helpers/date";
import { IModal, IHabit } from "../helpers/types";
import { CloseSVG } from "../assets/SVG/CloseSVG";

interface ModalProps {
  modal: IModal;
  setModal: React.Dispatch<React.SetStateAction<IModal>>;
  habits: IHabit[];
  updateHabits: React.Dispatch<React.SetStateAction<IHabit[]>>;
}

const Modal = ({ modal, setModal, habits, updateHabits }: ModalProps) => {
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
      <div className={`modal ${modal.color}`}>
        <button className="closeBtn" onClick={() => setModal(null)}>
          <CloseSVG />
        </button>

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
              aria-label="Edit habit name"
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
              <option value="blue">Blue</option>
              <option value="red">Red</option>
              <option value="green">Green</option>
              <option value="orange">Orange</option>
            </select>

            <div className="history flex">
              {[...new Array(120).fill(false), ...modal.days]
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
              {Object.keys(daysOfWeek).map((day) => {
                return (
                  <button
                    className={
                      modal.schedule.includes(parseInt(day))
                        ? `selected ${modal.color}`
                        : ""
                    }
                    value={day}
                    onClick={toggleScheduleDate}
                  >
                    {day == "4" ? "Th" : daysOfWeek[day][0]}
                  </button>
                );
              })}
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
