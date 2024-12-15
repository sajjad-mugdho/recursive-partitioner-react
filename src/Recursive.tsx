import React from "react";

interface ChildNode {
  id: string;
  type: "v" | "h";
  color: string;
  width: number;
  height: number;
  isParent: boolean;
  parentId?: string;
  childrens: ChildNode[];
}

interface RecursiveProps {
  data: ChildNode[];
  callback: (id: string, type: "v" | "h") => void;
  remove: (id: string) => void;
  handleResize: (
    e: React.MouseEvent<HTMLDivElement>,
    parentId: string,
    type: "v" | "h"
  ) => void;
  parent: ChildNode | null;
}

const Recursive: React.FC<RecursiveProps> = ({
  data,
  callback,
  remove,
  handleResize,
  parent,
}) => {
  return (
    <>
      {data.map((child, i) => (
        <React.Fragment key={child.id}>
          {/* Render the resize handle between child elements */}
          {parent && i === 1 && (
            <div
              className="border border-black bg-black"
              onMouseDown={(e) => handleResize(e, parent.id, parent.type)}
              style={{
                cursor: `${parent.type === "v" ? "col-resize" : "row-resize"}`,
                width: `${parent.type === "v" ? "3px" : "100%"}`,
                height: `${parent.type === "v" ? "100%" : "3px"}`,
              }}
            ></div>
          )}
          {/* Render the current child node */}
          <div
            className={`flex ${
              child.type === "v" ? "flex-row" : "flex-col"
            } items-center justify-center`}
            style={{
              backgroundColor: `${!child.isParent && child.color}`,
              width: `${child.width}%`,
              height: `${child.height}%`,
            }}
          >
            {/* Render action buttons for non-parent nodes */}
            {!child.isParent && (
              <div className="flex gap-4">
                <button
                  className="bg-white px-2"
                  onClick={() => callback(child.id, "v")}
                >
                  v
                </button>
                <button
                  className="bg-white px-2"
                  onClick={() => callback(child.id, "h")}
                >
                  h
                </button>
                <button
                  className="bg-white px-2"
                  onClick={() => remove(child.id)}
                >
                  -
                </button>
              </div>
            )}

            {/* Recursively render child nodes */}
            <Recursive
              data={child.childrens}
              callback={callback}
              remove={remove}
              handleResize={handleResize}
              parent={child}
            />
          </div>
        </React.Fragment>
      ))}
    </>
  );
};

export default Recursive;
