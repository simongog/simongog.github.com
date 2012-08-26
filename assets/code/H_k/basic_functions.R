

# Read a file called file_name and create a data frame the following way
# (1) Parse all the lines of the form
# '# key = value'
# (2) Each unique key gets a column
data_frame_from_key_value_pairs <- function(file_name){
	lines <- readLines(file_name)
	lines <- lines[grep("^#.*=.*",lines)]
	d <- gsub("^#","",gsub("[[:space:]]","",unlist(strsplit(lines,split="="))))
	keys <- unique(d[seq(1,length(d),2)])
	keynr <- length(keys)
	dd <- d[seq(2,length(d),2)]
	dim(dd) <- c( keynr, length(dd)/keynr )
	data <- data.frame(t(dd))	
	names(data) <- keys	

	for (col in keys){
		t <- as.character(data[[col]])
		suppressWarnings( tt <- as.numeric(t) )
		if ( length( tt[is.na(tt)] ) == 0 ){ # if there are not NA in tt
			data[[col]] <- tt 
		}
	} 	
	data
}

append_runtimes <- function( data, file_name ){
	time_table <- read.table( web_file_name, sep="\t" )
	time_table_begin <- subset(time_table, time_table[[3]]=="begin")
	time_table_end <- subset(time_table, time_table[[3]]=="end")

	times <- cbind( time_table_begin[c(2)], 
					"rtime" = (time_table_end[['V6']]-time_table_begin[['V6']])/time_table_end[['V4']] )
	times_array <- times[['rtime']]
	timings <- length(times_array)/nrow(data)
	dim(times_array) <- c( timings, nrow(data) )
	times_array <- t(times_array)
	times_df <- data.frame(times_array)

	times_names <- paste( as.character(time_table_end[1:timings, ]$V1),
						  as.character(time_table_end[1:timings, ]$V2) )
	times_name <- gsub(" ", "_",times_names )

	colnames(times_df) <- times_name
	cbind(data, times_df)
}

format_str_fixed_width <- function(x, width=4){
	sx <- as.character(x)
	if ( nchar(sx) < width ){
		for (i in 1:(width-nchar(sx))){
			sx <- paste("\\D",sx, sep="")
		}
	}
	sx
}
