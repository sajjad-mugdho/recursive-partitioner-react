import { useState, useEffect } from "react";
import Recursive from "./Recursive";

interface Container {
  id: string;
  type: "v" | "h";
  color: string;
  width: number;
  height: number;
  isParent: boolean;
  childrens: Container[];
}

function App() {
  const [containers, setContainer] = useState<Container[]>([]);

  const getColor = (): string => {
    let randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor}`;
  };

  const getRandomId = (): string => {
    return (
      new Date().getTime().toString() +
      Math.floor(Math.random() * 16777215).toString(16)
    );
  };

  const update = (
    data: Container[],
    id: string,
    type: "v" | "h"
  ): Container[] => {
    return data.map((child) => {
      if (child.id == id) {
        return {
          ...child,
          type: type,
          isParent: true,
          childrens: [
            {
              id: getRandomId(),
              type: "v",
              color: child.color,
              width: 100,
              height: 100,
              isParent: false,
              parentId: child.id,
              childrens: [],
            },
            {
              id: getRandomId(),
              type: "v",
              color: getColor(),
              width: 100,
              height: 100,
              isParent: false,
              parentId: child.id,
              childrens: [],
            },
          ],
        };
      } else {
        return {
          ...child,
          childrens: update(child.childrens, id, type),
        };
      }
    });
  };

  const remove = (data: Container[], id: string): Container[] => {
    return data
      .filter((child) => child.id !== id || child.id == "root")
      .map((child) => {
        let updatedChild = { ...child };
        if (child.childrens && child.childrens.length > 0) {
          updatedChild.childrens = remove(child.childrens, id);
        }
        return updatedChild;
      })
      .filter((child) => {
        return (
          child.childrens.length > 0 || !child.isParent || child.id == "root"
        );
      });
  };

  const onUpdate = (id: string, type: "v" | "h") => {
    let updatedArray = update(containers, id, type);
    setContainer(updatedArray);
  };

  const onRemove = (id: string) => {
    let updatedArray = remove(containers, id);
    setContainer(updatedArray);
  };

  const resize = (
    data: Container[],
    parentId: string,
    width: number,
    height: number,
    type: "v" | "h"
  ): Container[] => {
    return data.map((child) => {
      if (child.id == parentId) {
        return {
          ...child,
          childrens: [
            {
              ...child.childrens[0],
              width:
                type == "v"
                  ? child.childrens[0].width - width
                  : child.childrens[0].width,
              height:
                type == "v"
                  ? child.childrens[0].height
                  : child.childrens[0].height - height,
            },
            {
              ...child.childrens[1],
              width:
                type == "v"
                  ? child.childrens[1].width + width
                  : child.childrens[1].width,
              height:
                type == "v"
                  ? child.childrens[1].height
                  : child.childrens[1].height + height,
            },
          ],
        };
      } else {
        return {
          ...child,
          childrens: resize(child.childrens, parentId, width, height, type),
        };
      }
    });
  };

  const onMouseDown = (
    e: React.MouseEvent,
    parent: string,
    type: "v" | "h"
  ) => {
    let initialX = e.clientX;
    let initialY = e.clientY;

    const handleMouseMove = throttle((e: MouseEvent) => {
      let width = initialX - e.clientX;
      let height = initialY - e.clientY;

      let updatedState = resize(containers, parent, width, height, type);
      setContainer(updatedState);
    }, 180);

    const mouseUpHandler = () => {
      document.removeEventListener("mouseup", mouseUpHandler);
      document.removeEventListener("mousemove", handleMouseMove);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", mouseUpHandler);
  };

  // Utility function to throttle function calls
  function throttle(func: Function, wait = 16) {
    let timeout: any = null;
    return (...args: any[]) => {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          func(...args);
        }, wait);
      }
    };
  }

  // Initialize containers on component mount
  useEffect(() => {
    const initialContainers: Container[] = [
      {
        id: "root",
        type: "v",
        color: getColor(),
        width: 100,
        height: 100,
        isParent: false,
        childrens: [],
      },
    ];

    setContainer([...initialContainers]);
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {containers.length && (
        <Recursive
          data={containers}
          callback={onUpdate}
          remove={onRemove}
          handleResize={onMouseDown}
          parent={null}
        />
      )}
    </div>
  );
}

export default App;
