<?php 
/**
 * Diese Function soll als Top Level Exception handler
 * definiert werden, um alle Exceptions abzufangen, die nicht 
 * in einem catch gefangen werden.
 * 
 * @param Exception $e
 */
function uncaught_exception_handler($e) {
	printf("Uncaught Exception occured: %s\n", $e->getMessage());
}
?>