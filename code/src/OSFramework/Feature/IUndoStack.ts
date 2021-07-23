// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature {
    /**
     * Exposed methods for UndoStack feature
     */
    export interface IUndoStack {
        stack: wijmo.undo.UndoStack;
        /**
         * Close a pending action, has to be call after the startAction and after the desired changed
         * @param T  Type of the Pending action, used to verify if the pending action waiting to be closed has the same type
         */
        closeAction<T>(T): void;
        /**
         * Sometimes we just need to push an action that already define its undo/redo state
         * @param action Action to be pushed into the stack
         */
        pushAction(action: unknown): void;
        /**
         * Start an action, normally executed before the changes is made
         * @param action Instance of an action
         */
        startAction(action: unknown): void;
        /**
         * Getter for the undoStack
         */
    }
}
